import { Router } from 'express';
import * as controller from './ToDo.controller.js';
import validate from '../../common/middleware/validate.middleware.js';
import createTodo from './dto/ToDo.create.dto.js';
import updateTodo from './dto/ToDo.update.dto.js';
import {authenticate } from '../auth/auth.middleware.js'
const todoRoutes = Router()

todoRoutes.post('/', authenticate,validate(createTodo), controller.CreateTodo)
todoRoutes.patch('/:id', authenticate, validate(updateTodo), controller.UpdateTodo)
todoRoutes.get('/', authenticate, controller.GetTodo)
todoRoutes.delete('/:id', authenticate, controller.DeleteTodo)

export default todoRoutes