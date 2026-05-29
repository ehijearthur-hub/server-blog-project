const Post = require("../models/Comment");


// Create Comment
exports.createComment = async (req, res) => {

   try {

      const { text } = req.body;

      const post = await Post.findById(req.params.postId);

      if (!post) {
         return res.status(404).json({
            message: "Post not found"
         });
      }

      const comment = await Comment.create({
         text,
         user: req.user._id,
         post: req.params.postId,
      });

      res.status(201).json(comment);

   } catch (error) {

      res.status(500).json({
         message: error.message
      });

   }

};
exports.getPostComments = async (req, res) => {

   try {

      const comments = await Comment.find({
         post: req.params.postId
      })
      .populate("user", "username")
      .sort({ createdAt: -1 });

      res.status(200).json(comments);

   } catch (error) {

      res.status(500).json({
         message: error.message
      });

   }

};


// Delete Comment
exports.deleteComment = async (req, res) => {

   try {

      const comment = await Comment.findById(req.params.commentId);

      if (!comment) {
         return res.status(404).json({
            message: "Comment not found"
         });
      }

      if (comment.user.toString() !== req.user._id.toString()) {

         return res.status(401).json({
            message: "Not authorized"
         });

      }

      await comment.deleteOne();

      res.status(200).json({
         message: "Comment deleted"
      });

   } catch (error) {

      res.status(500).json({
         message: error.message
      });

   }

};