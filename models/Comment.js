const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    text: {
      type: String,
      required: [true, "Comment cannot be empty"],
      trim: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);