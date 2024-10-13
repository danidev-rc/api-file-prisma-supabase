import { Router } from 'express'
import { getBooks, createBook } from '../controller/books.controller.js'

const router = Router()

router.get('/', getBooks)
router.post('/', createBook)

export default router
