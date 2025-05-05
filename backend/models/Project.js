import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    creator: {
        type: String,
        required: true
    },
    members: [{
        type: String
    }],
    shareToken: {
        type: String,
        unique: true
    },
    shareLink: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Project = mongoose.model("Project", projectSchema)

export default Project