import { Router } from "express"
import { query } from "express-validator"

import { AuthorizationMiddleware } from "../auth/middleware/AuthorizationMiddleware.js"
import BodyQueryValidationMiddleware from "../common/middleware/BodyQueryValidationMiddleware.js"
import TokenMiddleWare from "../common/middleware/TokenMiddleWare.js"
import QuickenController from "./controller/Quicken.controller.js"

const router = Router()

router
  .route("/")
  .get(
    TokenMiddleWare.extractAPIToken,
    query("apiToken").isString().isLength({ min: 64, max: 64 }),
    BodyQueryValidationMiddleware.verifyAPITokenFormat,
    AuthorizationMiddleware.isTokenAuthorized,
    QuickenController.getData,
  )

export default router
