import fs from 'fs'
import path from 'path'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

const docsDir = path.join(__dirname, './docs')

// Default swagger configuration
let swaggerModules = []

// Read all `.swagger.yaml` files inside `src/docs` if directory exists
if (fs.existsSync(docsDir)) {
  swaggerModules = fs
    .readdirSync(docsDir)
    .filter(file => file.endsWith('.swagger.yaml'))
    .map(file => YAML.load(path.join(docsDir, file)))
}

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Combined Swagger docs for all modules',
  },
  paths: swaggerModules.reduce((acc, doc) => ({ ...acc, ...doc.paths }), {}),
  components: {
    schemas: swaggerModules.reduce(
      (acc, doc) => ({ ...acc, ...(doc.components?.schemas || {}) }),
      {}
    ),
  },
  tags: swaggerModules.flatMap(doc => doc.tags || []),
}

import globalErrorHandler from './app/middleware/globalErrorhandler'
import routes from './app/routes/routes'

const app: Application = express()
// middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://fibre52-trial.vercel.app',
      'https://trial.fibre52.omarfarukkhan.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'set-token', 'reset-token', 'Set-Cookie'],
    credentials: true,
  })
)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

app.set('trust proxy', 1)
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use('/api/v1', routes)

app.use(globalErrorHandler)

// Serve Swagger UI and JSON
app.use('/api-docs', swaggerUi.serve as any, swaggerUi.setup(swaggerSpec) as any)
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// not found route
app.use((_, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'not found',
    errorMessage: [
      {
        path: '',
        message: 'Api not found',
      },
    ],
  })
})

export default app
