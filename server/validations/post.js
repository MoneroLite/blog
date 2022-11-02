import {body} from 'express-validator'

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}),
    body('text', 'Введите текст статьи').isLength({min: 3}),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]