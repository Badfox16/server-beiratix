import express from 'express'
import dotenv from 'dotenv'
import { connectToDatabase } from './config/db'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.listen(PORT, async () => {
  await connectToDatabase()
  console.log(`🚀 Servidor a correr na porta ${PORT}`)
})