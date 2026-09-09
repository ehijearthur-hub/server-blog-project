const paystack = require("../config/paystack");
const Post = require("../models/Post");

// This is what initiates a payment for boosting a post. 
// It checks if the post exists and if the user is the author before creating a payment transaction with Paystack.
exports.initiatePayment = async (req, res) => {

    try {
        const { postId } = req.body;

        const post = await Post.findById(postId);

        if (!post) {

            return res.status(404).json({ message: "Post not found"});

        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only boost your own post"
            });
        }
        
        const response = await paystack.post("/transaction/initialize",
            {
                email: req.user.email,
                amount: 500000,
                metadata: {
                    postId: post._id
                }
            }
        );

        res.status(200).json({ paymentUrl: response.data.data.authorization_url });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// This is what verifies the payment after the user has completed the transaction on Paystack.
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        message: "Payment reference is required"
      });
    }

    const response = await paystack.get(
      `/transaction/verify/${reference}`
    );

    const transaction = response.data.data;

    if (transaction.status !== "success") {
      return res.status(400).json({
        message: "Payment not successful",
        status: transaction.status
      });
    }

    if (transaction.amount !== 500000) {
      return res.status(400).json({
        message: "Invalid payment amount"
      });
    }

    const postId = transaction.metadata.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    if (post.boosted) {
      return res.status(400).json({
        message: "Post already boosted"
      });
    }

    post.boosted = true;
    await post.save();

    return res.status(200).json({
      message: "Post boosted successfully",
      post
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};