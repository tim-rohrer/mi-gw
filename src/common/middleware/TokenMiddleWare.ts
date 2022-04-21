import { NextFunction, Request, Response } from "express"

import Logger from "../../common/logger.js"

class TokenMiddleware {
  extractAPIToken(req: Request, res: Response, next: NextFunction) {
    Logger.debug(
      `TokenMiddleware.extractAPIToken starting process with ${JSON.stringify(
        req.query,
      )}`,
    )
    req.body = req.query
    Logger.debug(
      `TokenMiddleware.extractAPIToken provides ${JSON.stringify(req.body)}.`,
    )
    next()
  }
}

export default new TokenMiddleware()
