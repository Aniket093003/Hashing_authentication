import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import userModel from "./user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

mongoose.connect(
  `mongodb+srv://aniketkainth98107:zKcbtlNqEzF9OEYM@cluster0.hwudb.mongodb.net/Users`
);
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(411).json({
      Error: true,
      message: "All feilds {email, password, name} required",
    });
  }
  try {
    const existingUser = await userModel.findOne({
      email,
    });
    if (existingUser) {
      return res.json({
        message: "you are already signed up",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await userModel.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log(token);

    res.json({
      message: "Congratulation, You are signed up",
      user,
      token,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ Error: true, message: "Internal server error" });
  }
});

app.post("/signin", (req, res) => {});

app.listen(process.env.PORT);
