import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Введите имя').isLength({min: 2}),
    body('avatarUrl', 'Неверная ссылка на автарку').optional().isURL(),
]

export const loginValidation = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
]