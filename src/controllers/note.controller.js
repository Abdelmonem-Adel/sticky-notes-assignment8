import Note from "../db/models/note.model.js"
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body
    const note = await Note.create({ title, content, userId: req.userId })
    res.status(201).json(note)
  } catch (e) {
    res.status(400).json({ message: 'create failed' })
  }
}

export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params
    const note = await Note.findOneAndUpdate({ _id: noteId, userId: req.userId }, req.body, { new: true, runValidators: true })
    if (!note) return res.status(404).json({ message: 'not found' })
    res.json(note)
  } catch (e) {
    res.status(400).json({ message: 'update failed' })
  }
}

export const replaceNote = async (req, res) => {
  try {
    const { noteId } = req.params
    const data = { title: req.body.title, content: req.body.content, userId: req.userId }
    const note = await Note.findOneAndUpdate({ _id: noteId, userId: req.userId }, data, { new: true, overwrite: true, runValidators: true })
    if (!note) return res.status(404).json({ message: 'not found' })
    res.json(note)
  } catch (e) {
    res.status(400).json({ message: 'replace failed' })
  }
}

export const updateAllTitles = async (req, res) => {
  try {
    const { title } = req.body
    const r = await Note.updateMany({ userId: req.userId }, { $set: { title } }, { runValidators: true })
    res.json({ matched: r.matchedCount, modified: r.modifiedCount })
  } catch (e) {
    res.status(400).json({ message: 'bulk update failed' })
  }
}

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params
    const note = await Note.findOneAndDelete({ _id: noteId, userId: req.userId })
    if (!note) return res.status(404).json({ message: 'not found' })
    res.json(note)
  } catch (e) {
    res.status(400).json({ message: 'delete failed' })
  }
}

export const paginateSort = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1')
    const limit = parseInt(req.query.limit || '10')
    const skip = (page - 1) * limit
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 }).skip(skip).limit(limit)
    res.json(notes)
  } catch (e) {
    res.status(400).json({ message: 'list failed' })
  }
}

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params
    const note = await Note.findOne({ _id: id, userId: req.userId })
    if (!note) return res.status(404).json({ message: 'not found' })
    res.json(note)
  } catch (e) {
    res.status(400).json({ message: 'get failed' })
  }
}

export const getNoteByContent = async (req, res) => {
  try {
    const { content } = req.query
    const note = await Note.findOne({ userId: req.userId, content })
    if (!note) return res.status(404).json({ message: 'not found' })
    res.json(note)
  } catch (e) {
    res.status(400).json({ message: 'get failed' })
  }
}

export const noteWithUser = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).select('title userId createdAt').populate({ path: 'userId', select: 'email' })
    res.json(notes)
  } catch (e) {
    res.status(400).json({ message: 'get failed' })
  }
}

export const aggregateNotes = async (req, res) => {
  try {
    const title = req.query.title
    const match = { userId: req.userId }
    const pipeline = [
      { $match: match },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' }
    ]
    if (title) {
      pipeline.unshift({ $match: { title: { $regex: title, $options: 'i' }, userId: req.userId } })
    }
    pipeline.push({ $project: { title: 1, content: 1, createdAt: 1, 'user.name': 1, 'user.email': 1 } })
    const r = await Note.aggregate(pipeline)
    res.json(r)
  } catch (e) {
    res.status(400).json({ message: 'aggregate failed' })
  }
}

export const deleteAllNotes = async (req, res) => {
  try {
    const r = await Note.deleteMany({ userId: req.userId })
    res.json({ deleted: r.deletedCount })
  } catch (e) {
    res.status(400).json({ message: 'delete failed' })
  }
}
