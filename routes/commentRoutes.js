const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createComment,
    getPostComments,
    deleteComment,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

router.post("/:postId", protect, createComment);

router.get("/:postId", getPostComments);

router.delete("/:commentId", protect, deleteComment);

module.exports = router;
