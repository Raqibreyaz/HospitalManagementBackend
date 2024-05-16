import express from "express"
import { config } from "dotenv"
import cors from 'cors'
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/databaseConnection.js";
import messageRouter from './routes/message.routes.js'
import userRouter from './routes/user.routes.js'
import { errorMiddleware } from "./middlewares/Apierror.middlewares.js";
import appointmentRouter from './routes/appointment.routes.js'

const app = express();

// initialize path for environemt variables
config({ path: "./config/config.env" })

// handle cors error
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL,],
  methods: ["get", "post", "put", "delete"],
  credentials: true,
}))

app.use(cookieParser())

// the data given by frontend is not readable so convert in json 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "./tmp/"
}))

app.use('/api/v1/message', messageRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/appointment', appointmentRouter)


dbConnection()

app.use(errorMiddleware)

export default app;

