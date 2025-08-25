import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../db/models/user.model.js'
import { encryptText } from '../utils/crypto.js'

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'email exists' })
    const hashed = await bcrypt.hash(password, 10)
    const encPhone = encryptText(phone)
    const user = await User.create({ name, email, password: hashed, phone: encPhone, age })
    res.status(201).json({ id: user._id })
  } catch (e) {
    res.status(400).json({ message: 'signup failed' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'User Not SignUp' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(400).json({ message: 'invalid credentials' })
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  } catch (e) {
    res.status(400).json({ message: 'login failed' })
  }
}

export const updateMe = async (req, res) => {
  try {
    const updates = { ...req.body }
    delete updates.password
    if (updates.email) {
      const exists = await User.findOne({ email: updates.email, _id: { $ne: req.userId } })
      if (exists) return res.status(400).json({ message: 'email exists' })
    }
    if (updates.phone) updates.phone = updates.phone ? updates.phone = (await (await import('../utils/crypto.js')).encryptText(updates.phone)) : updates.phone
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ message: 'not found' })
    res.json({ id: user._id, email: user.email, name: user.name, phone: user.phone, age: user.age })
  } catch (e) {
    res.status(400).json({ message: 'update failed' })
  }
}

export const deleteMe = async (req, res) => {
  try {
    const r = await User.deleteOne({ _id: req.userId })
    res.json({ deleted: r.deletedCount === 1 })
  } catch (e) {
    res.status(400).json({ message: 'delete failed' })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'not found' })
    res.json({ id: user._id, email: user.email, name: user.name, phone: user.phone, age: user.age, createdAt: user.createdAt, updatedAt: user.updatedAt })
  } catch (e) {
    res.status(400).json({ message: 'get failed' })
  }
}
