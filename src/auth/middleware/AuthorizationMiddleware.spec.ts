import { getMockReq, getMockRes } from "@jest-mock/express"

import AuthorizationError from "../../common/custom_errors/AuthorizationError.js"
import { AuthorizationMiddleware } from "./AuthorizationMiddleware.js"

const { res, next, mockClear } = getMockRes()

describe("Authorization Middleware", () => {
  beforeEach(() => mockClear())

  it("should verify the presented API Token from the authorization middleware object", () => {
    const errorResponse = new AuthorizationError(
      "The presented API token does not permit you access to the requested service. Please request the additional authorization.",
    )
    const req = getMockReq({
      body: {
        apiToken:
          "nCUYlC7G0I77FaZTm0skchNswhAJIdfC0WrUNMcnlsG5G2NDe2VYcyr1EcH52bKV",
      },
    })
    AuthorizationMiddleware.getInstance()

    AuthorizationMiddleware.isTokenAuthorized(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).not.toHaveBeenCalledWith(errorResponse)
  })
  it("should return an error if the API Token is not valid", () => {
    const req = getMockReq({
      body: {
        apiToken:
          "NCUYlC7G0I77FaZTm0skchNswhAJIdfC0WrUNMcnlsG5G2NDe2VYcyr1EcH52bKV",
      },
    })
    const expectedResponse = new AuthorizationError(
      "The presented API token does not permit you access to the requested service. Please request the additional authorization.",
    )
    AuthorizationMiddleware.getInstance()

    AuthorizationMiddleware.isTokenAuthorized(req, res, next)

    expect(next).toHaveBeenCalledWith(expectedResponse)
  })
})
