import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import userModel from "./user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { DB_NAME } from "./constants.js";
const app = express();
app.use(express.json());

mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  console.log("l");

  return res.status(200).json({ Hello: "hello" });
});

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
    console.error(error);
    res.status(500).json({ Error: true, message: "Internal server error" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      Error: true,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        Error: true,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        Error: true,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      message: user.password,

      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: true, message: "Internal server error" });
  }
});

app.get("/me", async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedUser.id; 

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Welcome back!", user: { name: user.name,  } });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(process.env.PORT);