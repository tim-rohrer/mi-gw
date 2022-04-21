import app from "./server.js"
import Logger from "./common/logger.js"

const port = 5000

app.listen(port, () => {
  Logger.info(`Server listening on port ${port}.`)
  console.log(`listening on port ${port}`)
})
