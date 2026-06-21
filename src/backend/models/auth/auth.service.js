import User from './auth.model.js'
import ApiError from '../../common/utils/ApiError.js'
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateResetToken,
} from '../../common/utils/jwt.utils.js'
import crypto from 'crypto'
import { sendVerificationEmail, sendResetPasswordEmail } from '../../common/config/email.js'


const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex')
}

const register = async ({ name, email, password, role }) => {
    const user = await User.findOne({ email });
    if (user) throw ApiError.badRequest("User already registered")

    const { rawToken, hashedToken } = generateResetToken()
    const newUser = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashedToken,
    })
    try {
        await sendVerificationEmail(email, rawToken);
    } catch (err) {
        console.error("Failed to send verification email:", err.message);
    }
    console.log(rawToken);
    const newUserObj = newUser.toObject();
    delete newUserObj.password;
    delete newUserObj.verificationToken;
    return newUserObj;
}

const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password')
    if (!user) throw ApiError.unauthorized('Incorrect Password or Email')
    const comparePass = await user.comparePassword(password)
    if (!comparePass) throw ApiError.unauthorized('Incorrect Password or Email')
    if (!user.isVerified) throw ApiError.forbidden('Please verify yoour email before login')

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken }
}

const refresh = async (token) => {
    if (!token) throw ApiError.unauthorized('Refresh Token Missing');
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select('+refreshToken')

    if (!user) throw ApiError.unauthorized("User No Longer exists")

    if (user.refreshToken !== hashToken(token)) throw ApiError.unauthorized("Invalid refresh Token");
    const accessToken = generateAccessToken({ id: user._id, role: user.role })

    return { accessToken }

}

const logout = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null })
}
// send email

const verifyEmail = async (token) => {

    const trimmed = String(token).trim();
    if (!trimmed) {
        throw ApiError.badRequest("Invalid or expired verification token")
    }
    const hashedToken = hashToken(trimmed);

    let user = await User.findOne({ verificationToken: hashedToken }).select('+verificationToken')

    if (!user) {
        user = await User.findOne({ verificationToken: trimmed }).select('+verificationToken')
    }

    if (!user) throw ApiError.badRequest('Invalid or expired verfication token');

    await User.findByIdAndUpdate(user._id, {
        $set: { isVerified: true },
        $unset: { verificationToken: 1 },
    })
    return user;
}
const forgetPassword = async (email) => {
    const user = await User.findOne({ email })

    if (!user) throw ApiError.unauthorized("User not found")

    const { rawToken, hashedToken } = generateResetToken()
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save()
    try {
        await sendResetPasswordEmail(email, rawToken)
    } catch (err) {
        console.log("Failed To Send Email: ", err.message);
    }


}

const resetPassword = async (token, newPassword) => {

    const hashedToken = hashToken(token)
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpires')

    if (!user) throw ApiError.badRequest('Invalid or expired reset token')

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save()
}

const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notfound('User not found')
    return user
}
export {
    register,
    login,
    refresh,
    logout,
    forgetPassword,
    resetPassword,
    verifyEmail,
    getMe
}