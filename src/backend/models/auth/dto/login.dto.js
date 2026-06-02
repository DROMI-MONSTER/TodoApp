import Joi from 'joi';
import BaseDto from '../../../common/dto/base.dto.js'


class Login extends BaseDto {
    static schema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi
            .string()
            .pattern(/(?=.*[A-Z])(?=.*\d)/)
            .min(8)
            .required()
            .message("Password must contain at least one uppercase letter and one digit"),
    })
}

export default Login