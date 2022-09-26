const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
mongoose.connect('mongodb://localhost:27017/social-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Mongodb successfully connected....')
}).catch((err) => {
    console.log('something wrong' + err)
})


app.use(express.json());
app.use('/api/users', authRouter)
app.use('/api/users', userRouter)
app.use('/api/users', postRouter)






app.listen(process.env.PORT, () => {
    console.log(`server runnig at http://localhost:${process.env.PORT}`)
})