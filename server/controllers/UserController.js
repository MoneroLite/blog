import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

import UserModel from '../models/User.js'

export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const doc = UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })
        // сохранение данные в бд
        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id,
            }, 
            process.env.SECRET_JWT_KEY,
            {
                expiresIn: '30d',
            }
        )

        const {passwordHash, ...userData} = user._doc

        res.json({
            succes: true,
            ...userData,
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}

export const login = async (req,res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).json({
                message: 'Неверный логин или пароль ^(',
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return req.status(400).json({
                message: 'Неверный логин или пароль',
            })
        }

        const token = jwt.sign(
            {
                _id: user._id,
            }, 
            process.env.SECRET_JWT_KEY,
            {
                expiresIn: '30d',
            }
        )

        const {passwordHash, ...userData} = user._doc

        res.json({
            succes: true,
            ...userData,
            token,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user){
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const {passwordHash, ...userData} = user._doc

        res.json({
            succes: true,
            userData,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Нет доступа'
        })
    }
    
}