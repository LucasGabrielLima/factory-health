import { Schema, model } from "mongoose";

const machineDataSchema = new Schema({
    machine: {
        type: String,
        required: [true, "machine name is required"],
    },
    datapoints: {
        type: Object,
        required: [true, "datapoints are required"]
    },
    score: {
        type: Number,
        required: [true, "score is required"]
    },
    username: {
        type: String,
        required: [true, "username is required"],
    },
    userId: {
        type: String,
        required: [true, "userId is required"],
    },
    date: {
        type: Date,
        required: [true, "date is required"]

    }
})

export default model("machineData", machineDataSchema)