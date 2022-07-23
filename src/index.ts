import * as dotenv from "dotenv"

import Logger from "./common/logger.js"
import app from "./server.js"

dotenv.config()
const port = 5000

app.listen(port, () => {
  Logger.info(`Server listening on port ${port}.`)
  console.log(`listening on port ${port}`)
})
