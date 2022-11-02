import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import mongoose from 'mongoose';
import {registerValidation, loginValidation} from './validations/auth.js'
import checkAuth from './utils/authCheck.js'
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import { postCreateValidation } from './validations/post.js';

mongoose
.connect(process.env.DB_CONNECT)
.then(() => console.log('connect to DB successfully'))
.catch((err) => console.log('DB error', err))

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())

app.post('/auth/login',loginValidation, UserController.login)
app.post('/auth/registration', registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts',checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id',checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)

app.listen(port, (err) => {
    if (err) {
        return logger.error(err)
    }
    console.log(`serves started on port ${port}`)
})