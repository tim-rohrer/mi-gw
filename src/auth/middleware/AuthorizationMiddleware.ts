import { NextFunction, Request, Response } from "express"

import AuthorizationError from "../../common/AuthorizationError.js"
import Logger from "../../common/logger.js"

export class AuthorizationMiddleware {
  private static instance: AuthorizationMiddleware =
    new AuthorizationMiddleware()

  private constructor() {
    if (AuthorizationMiddleware.instance) {
      throw new Error(
        "Error: Instantiation failed: Use AuthorizationMiddleware.getInstance() instead of new.",
      )
    }
    AuthorizationMiddleware.instance = this
  }

  public static getInstance(): AuthorizationMiddleware {
    return AuthorizationMiddleware.instance
  }

  public static async isTokenAuthorized(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    Logger.debug("Starting AuthorizationMiddleware.isTokenAuthorized.")
    const { apiToken } = req.body
    Logger.debug(
      `AuthorizationMiddleware.isTokenAuthorized with token ${req.body.apiToken}`,
    )
    /** Hardcoded for testing purposes. */
    if (
      apiToken !==
      "nCUYlC7G0I77FaZTm0skchNswhAJIdfC0WrUNMcnlsG5G2NDe2VYcyr1EcH52bKV"
    ) {
      Logger.info(
        "AuthorizationMiddleware.isTokenAuthorized: Token not authorized",
      )
      return next(
        new AuthorizationError(
          "The presented API token does not permit you access to the requested service. Please request the additional authorization.",
        ),
      )
    }
    next()
  }
}
