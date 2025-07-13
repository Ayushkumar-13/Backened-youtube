import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


// routes import 
import healthcheckRouter from './routes/healthcheck.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import commentRouter from './routes/comment.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import likeRouter from './routes/like.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import videoRouter from './routes/video.routes.js'
import userRouter from './routes/user.routes.js'

// routed declaration 

// as app.get ()------>>>> syntax is not used because here controllers and routers are defined in a separate file so we will use the middleware
//            ()------>>>  this syntax is used when all the things like controllers and the routes are defined in a single file.

// routes declaration 
app.use("/api/v1/users", userRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/video", videoRouter)


// http://localhost:8000/api/v1/users/register    ---->>>>> this type of api we are creating 
export { app }  
