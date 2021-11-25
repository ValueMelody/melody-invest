import express, { Response } from 'express'
import 'express-async-errors'
import dotenv from 'dotenv'
import { initConnection } from './adapters/database'
import syncRouter from './routers/sync'
import * as errorEnum from './enums/error'

dotenv.config()

const app = express()
export default app

const port = process.env.SERVER_PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initConnection()

app.use('/sync', syncRouter)

// @ts-ignore
app.use((err: any, req, res: Response, next) => {
  console.error(err)
  const internalError = errorEnum.HTTP_ERRORS.INTERNAL_SERVER_ERROR
  res.status(err?.code || internalError.code).send({
    message: err?.message || internalError.message
  })
  next(err)
})

try {
  app.listen(port, (): void => {
    console.info(`Connected successfully on port ${port}`)
  })
} catch (error) {
  console.error(`Error occured: ${error}`)
}
