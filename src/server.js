import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRouter from './routes/user.routes.js'
import noteRouter from './routes/note.routes.js'

dotenv.config()
const app = express()
app.use(express.json())

app.use('/users', userRouter)
app.use('/notes', noteRouter)

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log('server running on port ' + PORT)
  })
}).catch(err => {
  console.log('db error', err.message)
})
