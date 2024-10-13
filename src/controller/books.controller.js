import { prisma } from '../db.js'
import { supabase } from '../config.js'
import multer from 'multer'

export const getBooks = async (req, res) => {
  const books = await prisma.book.findMany()
  res.json(books)
}

const upload = multer({ storage: multer.memoryStorage() }).single('image')

export const createBook = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: 'Error uploading file' })
    }

    const { title, author, publishedDate } = req.body
    const file = req.file

    if (!file) {
      return res.status(400).json({ error: 'Image file is required' })
    }

    try {
      // Subir la imagen a Supabase Storage
      const { data, error: uploadError } = await supabase
        .storage
        .from('books')
        .upload(`public/${file.originalname}`, file.buffer, {
          contentType: file.mimetype
        })

      if (uploadError) {
        return res.status(500).json({ error: 'Error uploading file: ' + uploadError.message })
      }

      // Verificar si la subida fue exitosa
      if (!data) {
        return res.status(500).json({ error: 'Failed to upload file' })
      }

      // Obtener URL pública de la imagen subida
      const { data: publicUrlData, error: urlError } = await supabase
        .storage
        .from('books')
        .getPublicUrl(`public/${file.originalname}`)

      if (urlError) {
        return res.status(500).json({ error: 'Error getting public URL: ' + urlError.message })
      }

      const publicURL = publicUrlData.publicUrl

      if (!publicURL) {
        return res.status(500).json({ error: 'Public URL is undefined' })
      }

      // Crear libro en la base de datos
      const newBook = await prisma.book.create({
        data: {
          title,
          author,
          image: publicURL, // Guardar la URL de la imagen
          publishedDate: new Date(publishedDate)
        }
      })
      res.status(201).json(newBook)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}
