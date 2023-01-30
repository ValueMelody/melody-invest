import 'express-async-errors'
import * as adapterEnum from 'enums/adapter'
import * as errorEnum from 'enums/error'
import express, { NextFunction, Request, Response, Router } from 'express'
import http, { Server as HttpServer } from 'http'
import https, { Server as HttpsServer } from 'https'
import { attachRoutes as attachSystemRoutes } from 'routers/system'
import { attachRoutes as attachTradersRoutes } from 'routers/traders'
import { attachRoutes as attachUsersRoutes } from 'routers/users'
import compression from 'compression'
import cors from 'cors'
import fs from 'fs'
import { initConnection as initCache } from 'adapters/cache'
import { initConnection as initDatabase } from 'adapters/database'
import path from 'path'

const app = express()
export default app

const port = adapterEnum.HostConfig.ServerPort || 3001
const host = adapterEnum.HostConfig.ServerHost || '127.0.0.1'

app.use(cors({
  origin: `${adapterEnum.HostConfig.ClientType}://${adapterEnum.HostConfig.ClientHost}`,
}))
app.use(express.json())
app.use(compression())
app.use(express.urlencoded({ extended: true }))

initDatabase()
initCache()

const systemRouter = Router()
attachSystemRoutes(systemRouter)
app.use('/system', systemRouter)

const usersRouter = Router()
attachUsersRoutes(usersRouter)
app.use('/users', usersRouter)

const tradersRouter = Router()
attachTradersRoutes(tradersRouter)
app.use('/traders', tradersRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  const internalError = errorEnum.Default.InternalServerError
  res.status(err?.code || internalError.code).send({
    message: err?.message || internalError.message,
  })
  next(err)
})

const getServer = (): HttpServer | HttpsServer => {
  const isHttps = adapterEnum.HostConfig.ServerType === 'https'
  const server = isHttps ? https : http

  if (isHttps) {
    const options = {
      key: fs.readFileSync(path.join(__dirname, '../key.pem'), 'utf8'),
      cert: fs.readFileSync(path.join(__dirname, '../cert.pem'), 'utf8'),
    }
    return server.createServer(options, app)
  }
  return server.createServer(app)
}

try {
  const server = getServer()
  server.listen(port, host, (): void => {
    console.info(`Connected successfully on port ${port}`)
  })
} catch (error) {
  console.error('Error occured:')
  console.error(error)
}
