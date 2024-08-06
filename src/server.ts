import express from 'express'
import { port } from './config'
import router from './report/routes'

export default function init() {
  const app = express()

  app.use('/', router)

  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
  })

  return app
}

