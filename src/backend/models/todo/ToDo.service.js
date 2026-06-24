import Todo from './ToDo.model.js';
import User from '../auth/auth.model.js'
import ApiError from '../../common/utils/ApiError.js';

const createTodo = async ({ title, description, user_id, priority, tags, dueDate }) => {
    const user = await User.findById(user_id)
    if (!user) throw ApiError.unauthorized('User not exist')


    const newTodo = await Todo.create({
        title,
        description,
        user_id,
        priority,
        tags,
        dueDate
    })

    const todoObj = newTodo.toObject()
    delete todoObj.user_id;
    return todoObj
}

const updateTodo = async (req, res) => {
    const user = await User.findById(user_id)
    if (!user) throw ApiError.unauthorized('User not exist')

    const valid
}

/*
c -> create todo - post
r -> get todos - get
u -> update todo - post
d -> delete todo - delete
*/


export {
    createTodo
}