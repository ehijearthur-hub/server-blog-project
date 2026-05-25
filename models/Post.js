const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"],
        trim: true,
    },

    body: {
        type: String,
        required: [true, "Please add content"]
    },

    featuredImage: {
        type: String,
        default: "",
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    boosted: {
        type: Boolean,
        default: false,
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true }
);


module.exports = mongoose.model("Post", postSchema);