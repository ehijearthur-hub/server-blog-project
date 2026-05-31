const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => {
  console.error("MongoDB connection error:");
  console.error(err);
});




app.get("/", (req, res) => {
    res.send("API is running...")
});
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes); 
app.use("/api/comments", commentRoutes);
// app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});