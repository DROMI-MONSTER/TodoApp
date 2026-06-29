import Joi from 'joi';
import BaseDto from '../../../common/dto/base.dto.js';

class updateTodo extends BaseDto {
    static schema = Joi.object({

        title: Joi
            .string()
            .trim()
            .allow(''),

        description: Joi
            .string()
            .trim()
            .allow(''),

        priority: Joi
            .string()
            .valid('high', 'low', 'medium')
            .lowercase(),

        tags: Joi
            .array()
            .items(
                Joi
                    .string()
                    .trim()
                    .min(1)
            ).max(10),

        isCompleted: Joi.boolean(),

        dueDate: Joi
            .date()
            .iso(),
    }).min(2)
}

export default updateTodo
