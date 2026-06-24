import Joi from 'joi';
import BaseDto from '../../../common/dto/base.dto.js';

class createTodo extends BaseDto {
    static schema = Joi.object({
        title: Joi.string().min(1).trim().required(),
        description: Joi.string().trim().default('No Discription'),
        priority: Joi.string().valid('high', 'low', 'medium').lowercase().default('low'),
        tags: Joi.array().items(Joi.string()).max(10).default([]),
        dueDate: Joi.date().optional(),
    })
}

export default createTodo
