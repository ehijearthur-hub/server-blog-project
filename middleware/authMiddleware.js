const jwt = require("jsonwebtoken");
const User = require("../models/User")


const protect = async (req, res, next) => {
    try {

        let token;

        if (
            

            req.headers.authorization &&

            req.headers.authorization.startsWith("Bearer")

        ) {

            token = req.headers.authorization.split(" ")[1];
console.log(req.headers.authorization);
console.log(token);
            const decoded = jwt.verify(
                token, process.env.JWT_SECRET
            );

            req.user = await User.findById(decoded.id).select("-password");

            next();
            
        } else {

            return res.status(401).json({
                message: "Not authorized, no token"
            });
        }

    } catch (error) {

    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
        message: error.message
    });
}

}

module.exports = protect;