import Todo from './ToDo.model.js';
import User from '../auth/auth.model.js'
import ApiError from '../../common/utils/ApiError.js';
import crypto from 'crypto'



const createTodo = async ({ title, description, user_id, priority, tags, dueDate }) => {
    const user = await User.findById(user_id)
    if (!user) throw ApiError.unauthorized('User not exist')


    const newTodo = await Todo.create({
        title,
        description,
        user_id,
        priority,
        tags,
        dueDate,
    })

    const todoObj = newTodo.toObject()
    delete todoObj.user_id;
    return todoObj
}

const updateTodo = async (user_id, todo_id, valsToBeUpdated) => {
    try {
        const userId = user_id;
        const todoId = todo_id;
        const updates = valsToBeUpdated;

        if (Object.keys(updates).length === 0) throw ApiError.notfound("data not found for update-")

        const updatingValues = await Todo.findOneAndUpdate({ _id: todoId, user_id: userId },
            { $set: updates },
            { returnDocument: 'after', runValidators: true })

        if (!updatingValues) throw ApiError.badRequest("ID not found or database connection failed during updaing process.")

        const updatedObjects = updatingValues.toObject()
        delete updatedObjects.user_id

        return updatedObjects
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') throw ApiError.conflict("Invalid Todo ID format")
        throw ApiError.badRequest("Internal server error")
    }
}

const getTodos = async ({ userId }) => {
    const allTodos = await Todo.find({ user_id: userId }).lean()
    if (allTodos.length === 0) throw ApiError.badRequest('wrong user id')
    return allTodos
}

const deleteTodo = async ({ user_id, todo_id }) => {
    const userId = user_id
    const todoId = todo_id
    const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, user_id: userId })

    if (!deletedTodo) throw ApiError.badRequest(`data not found or user dosen't exist`)
}


export {
    createTodo,
    updateTodo,
    getTodos,
    deleteTodo
}