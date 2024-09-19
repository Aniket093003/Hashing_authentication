import mongoose from 'mongoose'

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        min: 3, max: 30
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6, max: 16
    }
});

const userModel = mongoose.model('User', userSchema)

export default userModel;