import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"

import ReqParamFormatError from "../custom_errors/ReqParamFormatError.js"
import Logger from "../logger.js"

export const verifyFieldsErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Logger.debug(
    `BodyQueryValidationMiddleware.verifyFieldErrors with ${JSON.stringify(
      req.body,
    )} ${JSON.stringify(req.query)}`,
  )
  const errors = validationResult(req)
  Logger.debug(
    `BodyQueryValidationMiddleware.verifyFieldsErrors ${JSON.stringify(
      errors,
    )}`,
  )
  if (!errors.isEmpty()) {
    Logger.error(`Validation errors ${JSON.stringify(errors)}`)
    const { param, msg } = errors.array({ onlyFirstError: true })[0]
    return next(new ReqParamFormatError(param, msg))
  }
  Logger.info(
    `Validation of parameters passed ${JSON.stringify(
      req.body,
    )} ${JSON.stringify(req.query)}`,
  )
  next()
}
