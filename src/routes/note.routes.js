import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { createNote, updateNote, replaceNote, updateAllTitles, deleteNote, paginateSort, getNoteById, getNoteByContent, noteWithUser, aggregateNotes, deleteAllNotes } from '../controllers/note.controller.js'

const router = Router()

router.post('/', auth, createNote)
router.patch('/:noteId', auth, updateNote)
router.put('/replace/:noteId', auth, replaceNote)
router.patch('/all', auth, updateAllTitles)
router.delete('/:noteId', auth, deleteNote)
router.get('/paginate-sort', auth, paginateSort)
router.get('/:id', auth, getNoteById)
router.get('/note-by-content', auth, getNoteByContent)
router.get('/note-with-user', auth, noteWithUser)
router.get('/aggregate', auth, aggregateNotes)
router.delete('/', auth, deleteAllNotes)

export default router
