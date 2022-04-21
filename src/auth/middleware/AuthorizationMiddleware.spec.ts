import { getMockReq, getMockRes } from "@jest-mock/express"

import { ErrorTypeTitle } from "../../common/ErrorTypeTitle.js"
import { HttpStatusCode } from "../../common/http-status-codes.js"
import HttpError from "../../common/HttpError.js"
import { AuthorizationMiddleware } from "./AuthorizationMiddleware.js"

const { res, next, mockClear } = getMockRes()

describe("Authorization Middleware", () => {
  beforeEach(() => mockClear())

  it("should verify the presented API Token from the authorization middleware object", () => {
    const errorResponse = new HttpError(
      ErrorTypeTitle.NOT_AUTHORIZED,
      HttpStatusCode.UNAUTHORIZED,
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
    const expectedResponse = new HttpError(
      ErrorTypeTitle.NOT_AUTHORIZED,
      HttpStatusCode.UNAUTHORIZED,
      "The presented API token does not permit you access to the requested service. Please request the additional authorization.",
    )
    AuthorizationMiddleware.getInstance()

    AuthorizationMiddleware.isTokenAuthorized(req, res, next)

    expect(next).toHaveBeenCalledWith(expectedResponse)
  })
  // it("should verify user's authorization from the database, and add to local.", async () => {
  //   const geocodeRequest = googleGeocodeRequest
  //   mockRequest = {
  //     query: geocodeRequest,
  //     body: geocodeRequest,
  //   }
  //   AuthorizationMiddleware.getInstance()
  //   AuthorizationMiddleware.addLocalAuthorization(
  //     "localTokenOnly",
  //     "localUserOnly",
  //   )
  //   const spy = jest.spyOn(usersService, "isUserAuthorized").mockResolvedValue(<
  //     OkImpl<string>
  //   >{
  //     ok: true,
  //     err: false,
  //     val: "goodDbUserId",
  //   })

  //   await AuthorizationMiddleware.isUserAuthorized(
  //     <Request>mockRequest,
  //     <Response>mockResponse,
  //     nextFunction,
  //   )

  //   expect(spy).toHaveBeenCalledTimes(1)
  //   expect(AuthorizationMiddleware.getLocalAuthorizations()).toHaveLength(2)
  // })
})
