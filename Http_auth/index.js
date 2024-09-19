import express from 'express'
import dotenv from "dotenv"
dotenv.config({path: './.env'})
import userModel from './user.js'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'



mongoose.connect(`mongodb+srv://aniketkainth98107:zKcbtlNqEzF9OEYM@cluster0.hwudb.mongodb.net/Users`)
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) =>  {
    const {name, email, password} = req.body;

    if(!email || !password || !name){
        return res.status(411).json({
            Error: true,
            message: "All feilds {email, password, name} required"  
        })
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 5);

        const user = await userModel.create({
            email,
            password: hashedPassword,
            name,
        });
        res.json({
            message: "Congratulation, You are signed up",user
        })
        
    } catch (error) {
        
    }
})


app.post("/signin", (req, res) =>{

})


app.listen(process.env.PORT);