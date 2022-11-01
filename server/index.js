import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import mongoose from 'mongoose';
import {registerValidation} from './validations/auth.js'
import checkAuth from './utils/authCheck.js'
import { getMe, login, register } from './controllers/UserController.js';

mongoose
.connect(process.env.DB_CONNECT)
.then(() => console.log('connect to DB successfully'))
.catch((err) => console.log('DB error', err))

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())

app.post('/auth/login', login)
app.post('/auth/register', registerValidation, register)
app.get('/auth/me', checkAuth, getMe)

app.listen(port, (err) => {
    if (err) {
        return logger.error(err)
    }
    console.log(`serves started on port ${port}`)
})