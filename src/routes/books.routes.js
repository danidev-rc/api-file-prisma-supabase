import { Router } from 'express'
import { getBooks, createBook, getBook, updateBook, deleteBook } from '../controller/books.controller.js'

const router = Router()

router.get('/', getBooks)
router.post('/', createBook)
router.get('/:id', getBook)
router.patch('/:id', updateBook)
router.delete('/:id', deleteBook)

export default router
