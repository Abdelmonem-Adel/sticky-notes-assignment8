import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
  const h = req.headers.authorization || ''
  const parts = h.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'unauthorized' })
  try {
    const decoded = jwt.verify(parts[1], process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (e) {
    res.status(401).json({ message: 'unauthorized' })
  }
}
