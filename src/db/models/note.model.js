import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        if (!v) return false
        return v !== v.toUpperCase()
      },
      message: 'title must not be all uppercase'
    }
  },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

const Note = mongoose.model('Note', noteSchema)
export default Note
