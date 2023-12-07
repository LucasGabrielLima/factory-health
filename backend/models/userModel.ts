import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "username already taken"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    }
})

export default model("User", userSchema)