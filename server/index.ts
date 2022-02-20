import express, { Response, Request, NextFunction } from 'express'
import 'express-async-errors'
import { initConnection as initDatabase } from './adapters/database'
// import { initConnection as initCache } from './adapters/cache'
import syncRouter from './routers/sync'
import calcRouter from './routers/calc'
import * as errorEnum from './enums/error'

const app = express()
export default app

const port = process.env.SERVER_PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initDatabase()
// initCache()

app.use('/sync', syncRouter)
app.use('/calc', calcRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  const internalError = errorEnum.HTTP_ERRORS.INTERNAL_SERVER_ERROR
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
