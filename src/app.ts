import express from 'express'
import dotenv from 'dotenv'
import { initConnection } from './adapters/database'
import syncRouter from './routers/sync'

dotenv.config()

const app = express()
export default app

const port = process.env.SERVER_PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initConnection()

app.use('/sync', syncRouter)

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`)
  })
} catch (error) {
  console.error(`Error occured: ${error}`)
}
