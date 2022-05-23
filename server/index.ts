import express, { Response, Request, NextFunction } from 'express'
import compression from 'compression'
import 'express-async-errors'
import cors from 'cors'
import { initConnection as initDatabase } from './adapters/database'
import { initConnection as initCache } from './adapters/cache'
import systemRouter from './routers/system'
import usersRouter from './routers/users'
import tradersRouter from './routers/traders'
import * as errorEnum from './enums/error'

const app = express()
export default app

const port = process.env.SERVER_PORT || 3000

app.use(cors())
app.use(express.json())
app.use(compression())
app.use(express.urlencoded({ extended: true }))

initDatabase()
initCache()

app.use('/system', systemRouter)
app.use('/users', usersRouter)
app.use('/traders', tradersRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  const internalError = errorEnum.Default.InternalServerError
  res.status(err?.code || internalError.code).send({
    message: err?.message || internalError.message,
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
