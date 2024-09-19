import express from 'express'
import dotenv from "dotenv"
dotenv.config({path: './.env'})
const app = express();
app.use(express.json());

app.post("/signup", (req, res) =>  {
    
})


app.post("/signin", (req, res) =>{

})


app.listen(process.env.PORT);