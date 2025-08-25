import { Router } from 'express'
import { signup, login, updateMe, deleteMe, getMe } from '../controllers/user.controller.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.put('/update', auth, updateMe)
router.delete('/delete', auth, deleteMe)
router.get('/get', auth, getMe)

export default router
