
import PostModel from "../models/Post.js"



export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (error) {
        res.status(500).json({
            message: 'не удалось получить статьи'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)
    } catch (error) {
        res.status(500).json({
            message: 'не удалось получить статьи'
        })
    }
}

export const getAllByTag = async (req, res) => {
    try {
        const tag = req.params.id
        const posts = await PostModel.find(
            { tags: tag }
        )
            .populate('user')
            .exec()

        res.json(posts)
    } catch (error) {
        res.status(500).json({
            message: 'не удалось получить статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        PostModel.findByIdAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'не удалось вернуть статью'
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }
                res.json(doc)
            }
        ).populate('user')
    } catch (error) {
        res.status(500).json({
            message: 'не удалось получить статьи'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'не удалось Удалить статью'
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }

                res.json({
                    success: true,
                })
            }
        )
    } catch (error) {
        res.status(500).json({
            message: 'не удалось получить статьи'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })
        const post = await doc.save()
        res.json(post)
    } catch (error) {
        res.status(500).json({
            message: 'не удалось создать статью'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            },
        )

        res.json({
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            message: 'не удалось обновить статью'
        })
    }
}