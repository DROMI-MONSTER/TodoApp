import ApiError from '../../common/utils/ApiError.js';
import { verifyAccessToken } from '../../common/utils/jwt.utils.js';
import User from "./auth.model.js"


const authenticate = async (req, res, next) => {

    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    console.log(token);
    if (!token) throw ApiError.unauthorized("Not Authenticated")
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (!user) throw ApiError.unauthorized("User no longer exists");
    req.user = {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
    };
    next();
}

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw ApiError.forbidden("You do not have permission to perform this action")
        }
        next()
    }

}
export { authenticate, authorize }


// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjMwZTE1ZGNmYmU4ZmNlNmYxOTM3NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzgwNjgyMzQ2LCJleHAiOjE3ODA2ODMyNDZ9.TkXDEIZLQeJpiPjQNM-CHadwNvJR82TLRaYFsZdjHMYeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjMwZTE1ZGNmYmU4ZmNlNmYxOTM3NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzgwNjgyMzQ2LCJleHAiOjE3ODA2ODMyNDZ9.TkXDEIZLQeJpiPjQNM-CHadwNvJR82TLRaYFsZdjHMY