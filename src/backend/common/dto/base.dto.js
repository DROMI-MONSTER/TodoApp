import Joi from 'joi';

class BaseDto {
    static schema = Joi.object({})
    static validate(data) {
        const { err, value } = this.schema.validate(data, {
            abortEarly: false,
            stripUnknown: true
        })
        if (err) {
            const errors = err.details.map(
                E => E.massage
            )
            return { errors, value: null }
        }
        return { errors: null, value }
    }
}

export default BaseDto