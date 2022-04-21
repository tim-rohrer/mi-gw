import { NextFunction, Request, Response } from "express"
import { ValidationError, validationResult } from "express-validator"

import APITokenFormatError from "../APITokenFormatError.js"
import Logger from "../logger.js"

class BodyQueryValidationMiddleware {
  static errorFormatter({ location, msg, param, value }: ValidationError) {
    Logger.debug(`BodyQueryValidationMiddleware.errorFormatter of ${param}`)
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}: ${value}]: ${msg}`
  }

  verifyFieldsErrors(req: Request, res: Response, next: NextFunction) {
    Logger.debug(
      `BodyQueryValidationMiddleware.verifyFieldErrors with ${JSON.stringify(
        req.body,
      )} ${JSON.stringify(req.query)}`,
    )
    const errors = validationResult(req).formatWith(
      BodyQueryValidationMiddleware.errorFormatter,
    )
    Logger.debug(
      `BodyQueryValidationMiddleware.verifyFieldsErrors ${JSON.stringify(
        errors,
      )}`,
    )
    if (!errors.isEmpty()) {
      Logger.error(`Validation errors ${JSON.stringify(errors)}`)
      next({ errors: errors.array() })
    }
    Logger.info(
      `Validation of parameters passed ${JSON.stringify(
        req.body,
      )} ${JSON.stringify(req.query)}`,
    )
    next()
  }

  verifyAPITokenFormat(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      next(
        new APITokenFormatError("Your request was missing a proper API Token."),
      )
    }
    next()
  }
}

export default new BodyQueryValidationMiddleware()
