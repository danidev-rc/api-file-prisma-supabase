import { Router } from 'express'

import booksRouter from './books.routes.js'

const router = Router()

router.use('/books', booksRouter)

export default router
