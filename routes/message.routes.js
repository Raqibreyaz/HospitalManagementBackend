import express from 'express'
import { getAllMessages, sendMessage } from '../controllers/message.controllers.js'
import { isAdminAuthenticated } from '../middlewares/auth.middlewares.js'

const router = express.Router()

router.post('/send', sendMessage)

router.get('/get-messages', isAdminAuthenticated, getAllMessages)

export default router;