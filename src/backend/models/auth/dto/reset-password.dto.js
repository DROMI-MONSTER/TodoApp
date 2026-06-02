import Joi from 'joi';
import BaseDto from '../../../common/dto/base.dto.js'


class ResetPasswordDto extends BaseDto {
    static schema = Joi.object({
        password: Joi
            .string()
            .pattern(/(?=.*[A-Z])(?=.*\d)/)
            .min(8)
            .required()
            .message("Password must contain at least one uppercase letter and one digit"),
    })
}

export default ResetPasswordDto