import { Router } from 'express';
import * as todoService from './ToDo.service.js';
import validate from '../../common/middleware/validate.middleware.js';
import createTodo from './dto/ToDo.create.dto.js';

const todoRoutes = Router()

todoRoutes.post('/todo', validate(createTodo), todoService.createTodo)