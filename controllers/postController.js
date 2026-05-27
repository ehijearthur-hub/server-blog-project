const Post = require("../models/Post");


// This is what creates a blog post
exports.createPost = async (req, res) => {
    
    try {
        const post = await Post.create({
            title: req.body.title,
            body: req.body.body,
            featuredImage: req.file ? req.file.path : null,
            author: req.user._id,
        });

        res.status(201).json(post);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getPosts = async (req, res) => {

    try {
        const posts = (await Post.find().populate("author", "username")).sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getSinglePost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id).populate("author", "username");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({
            message: error,message
        });
    }
};

exports.updatePost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }
        
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }
        
        post.title = req.body.title || post.title;
        post.body = req.body.body || post.body;
        
        if (req.file) {
            post.featuredImage = req.file.path;
        }
        
        const updatePost = await post.save();
        
        res.status(200).json(updatedPost);
    
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

exports.deletePost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        await post.deleteOne();

        res.status(200).json({
            message: "Post deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

exports.searchPosts = async (req, res) => {

    try {
        const keyword = req.query.search;
        const posts = await Post.find({
            title: {
                $regex: keyword,
                $options: "i"
            }
        });

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};


exports.getBoostedPosts = async (req, res) => {

    try {
        const posts = await Post.find({
            boosted: true
        });

        res.status(200).json(posts)

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};1

exports.toggleLike = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.includes(req.user_id);

        if (alreadyLiked) {
            post.likes = post.likes.filter( like => like.toString() !== req.user._id.toString);

        } else {
            post.likes.push(req.user._id);
        }

        await post.save();

        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};
