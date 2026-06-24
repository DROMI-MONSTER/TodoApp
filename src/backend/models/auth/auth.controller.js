import * as authService from './auth.service.js';
import ApiResponse from '../../common/utils/ApiResponse.js'

const register = async (req, res) => {
    const user = await authService.register(req.body);

    ApiResponse.ok(res, `Registration successful. please verify your email`, user)
}
const login = async (req, res) => {
    const { user, refreshToken, accessToken } = await authService.login(req.body);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.VITE_NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
    })

    ApiResponse.ok(res, `Login successful.`, { user, accessToken })
}

const refreshToken = async (req, res) => {
    const token = req.cookie?.refreshToken;
    const { accessToken } = await authService.refresh(req.body)
    ApiResponse.ok(res, "Token refreshed", { accessToken });
}

const logOut = async (req, res) => {
    await authService.logout(req.user.id)
    res.clearCookie('refreshToken')
    ApiResponse.ok(res, 'Logout successfully')
}

const verifyEmail = async (req, res) => {
    await authService.verifyEmail(req.params.token);
    ApiResponse.ok(res, 'Email Verfied Successfully')
}

const forgetPassword = async (req, res) => {
    await authService.forgetPassword(req.body.email)
    ApiResponse.ok(res, 'Password email send')
}
const resetPassword = async (req, res) => {
    await authService.resetPassword(req.params.token, req.body.password)
    ApiResponse.ok(res, 'Password reseted successfully')
}

const getMe = async (req, res) => {
    const user = await authService.getMe(req.user.id);
    console.log(req.user.id);
    ApiResponse.ok(res, "User Profile", user)
}
export {
    register,
    login,
    refreshToken,
    logOut,
    verifyEmail,
    forgetPassword,
    resetPassword,
    getMe,
}