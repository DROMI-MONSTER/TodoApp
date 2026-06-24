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

/*
create todo - post
update todo - post
delete todo - delete
get todos - get

 */


export {
    createTodo
}