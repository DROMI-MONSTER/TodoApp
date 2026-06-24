import mongoose, { Mongoose } from 'mongoose';

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 1,
        trim: true,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
        default:"No Discription"
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "UserId Required"],
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'low',
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (val) {
                return val.length <= 10;
            },
            message: "Cannot exceed 10 tags"
        }
    },
    dueDate: {
        type: Date,
    }
}, {timestamps: true})

export default mongoose.model('Todo', todoSchema)