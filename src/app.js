import express from 'express'
import cookieParser from 'cookie-parser'
import authRoute from "./backend/models/auth/auth.routes.js"
import ApiError from './backend/common/utils/ApiError.js'
import todoRoutes from './backend/models/todo/ToDo.routes.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoute);
app.use('/api/todo', todoRoutes);
app.all("{*path}", (req, res) => {
    throw ApiError.notfound(`Route ${req.originalUrl} not found`);
})


export default app