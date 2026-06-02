import Joi from 'joi';
import BaseDto from '../../../common/dto/base.dto.js'


class RegisterDto extends BaseDto {
    static schema = Joi.object({
        name: Joi
            .string()
            .trim()
            .min(2)
            .max(50)
            .required(),
        email: Joi
            .string()
            .email()
            .lowercase()
            .required(),
        password: Joi
            .string()
            .pattern(/(?=.*[A-Z])(?=.*\d)/)
            .min(8)
            .required()
            .message("Password must contain at least one uppercase letter and one digit"),
        role: Joi
            .string()
            .required()
            .valid('admin', 'user')
            .default('user')
    })
}

export default RegisterDto