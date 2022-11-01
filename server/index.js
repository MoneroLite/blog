import express from 'express';

const app = express();
const port = 5000;

app.use(express.json())

app.get('/', (req, res) => {
    res.send('HI!')
})

app.post('/auth/login', (req, res) => {
    console.log(req.body)
    res.json({
        success: true,
    })
})

app.listen(port, (err) => {
    if (err) {
        return logger.error(err)
    }
    console.log(`serves started on port ${port}`)
})