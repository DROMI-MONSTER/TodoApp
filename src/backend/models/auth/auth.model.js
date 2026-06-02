import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 50,
        required:[true,'Name is required']
    },
    email: {
        type: String,
        trim: true,
        lowercase:true,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        minLength:8,
        required: [true, "Password is required"],

    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default:"user"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {type:String, select: false},
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
}, { timestamps: true })


export default mongoose.model('User', userSchema);