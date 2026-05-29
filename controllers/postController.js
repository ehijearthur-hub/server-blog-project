const Post = require("../models/Post");

exports.createPost = async (req, res) => {

    try {

        const post = await Post.create({
            title: req.body.title,
            body: req.body.body,
            featuredImage: req.file?.path || "",
            author: req.user._id
        });

        res.status(201).json(post);

    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.getPosts = async (req, res) => {

    const keyword = req.query.search
        ? {
            title: {
                $regex: req.query.search,
                $options: "i"
            }
        }
        : {};

    const filter = req.query.boosted
        ? { boosted: req.query.boosted === "true" }
        : {};

    const posts = await Post.find({
        ...keyword,
        ...filter
    }).populate("author", "username");

    res.json(posts);
};

exports.getSinglePost = async (req, res) => {

    const post = await Post.findById(req.params.id)
    .populate("author", "username");

    res.json(post);
};

exports.toggleLike = async (req, res) => {

    const post = await Post.findById(req.params.id);

    const liked = post.likes.includes(req.user._id);

    if (liked) {
        post.likes.pull(req.user._id);
    } else {
        post.likes.push(req.user._id);
    }

    await post.save();

    res.json(post);
};