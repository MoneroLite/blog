import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import {registerValidation, loginValidation} from './validations/auth.js'
import {checkAuth, handleValidationErrors} from './utils/index.js'
import {UserController, PostController} from './controllers/index.js'
import {postCreateValidation} from './validations/post.js'
import cors from 'cors'

// подключение к бд
mongoose
.connect(process.env.DB_CONNECT)
.then(() => console.log('connect to DB successfully'))
.catch((err) => console.log('DB error', err))

const app = express();
const port = process.env.PORT || 5000;

// хранилище для файлов
const storage = multer.diskStorage({ 
    destination:(_, __, cb) => {
        cb(null, 'uploads')
    }, 
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }, 
})

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

// роут для сохранения картинки
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/registration', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts',checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id',checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.listen(port, (err) => {
    if (err) {
        return logger.error(err)
    }
    console.log(`serves started on port ${port}`)
})