import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})) 

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes import 

import userRouter from './routes/user.routes.js'


// routed declaration 

// as app.get ()------>>>> syntax is not used because here controllers and routers are defined in a separate file so we will use the middleware
//            ()------>>>  this syntax is used when all the things like controllers and the routes are defined in a single file.


app.use("/api/v1/users", userRouter)


// http://localhost:8000/api/v1/users/register    ---->>>>> this type of api we are creating 
export { app }  
