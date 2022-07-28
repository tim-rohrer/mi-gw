import * as dotenv from "dotenv"

import Logger from "./common/logger.js"
import app from "./server.js"
import { configuredMongoDatabase } from "./storage/mongodb-storage-service.js"

dotenv.config()
const port = 5000

try {
  app.listen(port, () => {
    Logger.info(
      `Server listening on port ${port} with database connected to ${configuredMongoDatabase.namespace}.`,
    )
    console.log(`listening on port ${port}`)
  })
} catch (error) {
  console.error(error)
}
