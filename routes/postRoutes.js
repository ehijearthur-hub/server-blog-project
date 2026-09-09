const express = require("express");

const router = express.Router();

const {
    createPost,

    getPosts,

    getSinglePost,

    updatePost,

    deletePost,

    searchPosts,

    getBoostedPosts,

    toggleLike

} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.post(
    "/",
    protect,
    upload.single("featuredImage"),
    createPost
);

router.get("/", getPosts);

router.get("/search/posts", searchPosts);

router.get("/boosted/all", getBoostedPosts);

router.get("/:id", getSinglePost);

router.put(
    "/:id",
    protect,
    upload.single("featuredImage"),
    updatePost
);

router.delete(
    "/:id",
    protect,
    deletePost
);

router.put(
    "/like/:id",
    protect,
    toggleLike
);

module.exports = router;
