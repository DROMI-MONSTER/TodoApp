import ApiResponse from '../../common/utils/ApiResponse.js';
import { createTodo, updateTodo, getTodos, deleteTodo } from './ToDo.service.js';


const CreateTodo = async (req, res) => {
    req.body["user_id"] = req.user.id
    const todo = await createTodo(req.body)

    ApiResponse.created(res, "todo successfully created", todo);
}

const UpdateTodo = async (req, res) => {
    const todo = await updateTodo(req.user.id, req.params.id, req.body)

    ApiResponse.ok(res, "todo successfully updated", todo);
}
const GetTodo = async (req, res) => {
    const todo = await getTodos({ userId: req.user.id })

    ApiResponse.ok(res, "todo successfully fetched", todo);
}
const DeleteTodo = async (req, res) => {
    const todo = await deleteTodo({ user_id: req.user.id, todo_id: req.params.id })
    ApiResponse.noContent(res);
}


export { CreateTodo, UpdateTodo, GetTodo, DeleteTodo }