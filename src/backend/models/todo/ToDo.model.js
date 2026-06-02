import mongoose, { Mongoose } from 'mongoose';

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    user_id: {
        id: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'low',
    },
    category: {
        type: String,
        minLength: 2,
        maxLength: 60,
        default: 'individual'
    }
})

export default mongoose.model('Todo', todoSchema)