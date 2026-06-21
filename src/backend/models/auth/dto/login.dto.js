import Joi from 'joi';
import BaseDto from '../../../common/dto/base.dto.js'


class Login extends BaseDto {
    static schema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi
            .string()
            .min(8)
            .message("Password must contain at least one uppercase letter and one digit")
            .pattern(/(?=.*[A-Z])(?=.*\d)/)
            .required(),
    })
}

export default Login