const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// This endpoint is responsible for registering a user in the database. 
// It checks if the user already exists, hashes the password, and then creates a new user. 
// Finally, it returns the user data along with a JWT token for authentication.
exports.registerUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({

            username,

            email,

            password: hashedPassword,
        });

        res.status(201).json({

            _id: user._id,

            username: user.username,

            email: user.email,

            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// This endpoint is responsible for logging in a user. 
// It checks if the user exists, compares the provided password with the hashed password in the database, and if they match, it returns the user data along with a JWT token for authentication.
exports.loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("password");

        if (!user) {
            return  res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        res.status(200).json({

            _id: user._id,

            username: user.username,

            email:  user.email,

            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};