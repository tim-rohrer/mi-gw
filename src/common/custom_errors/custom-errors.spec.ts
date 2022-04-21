import { HttpStatusCode } from "../http-status-codes.js"
import APITokenFormatError from "./APITokenFormatError.js"
import AuthorizationError from "./AuthorizationError.js"
import BaseError from "./BaseError.js"
import ValidationError from "./ValidationError.js"

describe("Custom errors", () => {
  describe("Abstract BaseError", () => {
    class TestBaseError extends BaseError {}
    it("returns contains the correct fields", () => {
      const err = new TestBaseError("Test message for this error.")

      expect(err.name).toBe("TestBaseError")
      expect(err.message).toBe("Test message for this error.")
      expect(err.stack).toBeDefined()
    })
  })
  describe("Abstract ValidationError", () => {
    class TestValidationError extends ValidationError {}
    it("contains the correct predefined and passed fields", () => {
      const err = new TestValidationError()

      expect(err.name).toBe("TestValidationError")
      expect(err.httpCode).toBe(HttpStatusCode.BAD_REQUEST)
      expect(err.stack).toBeDefined()
    })
  })
  describe("APITokenFormatError", () => {
    it("provides default problemTitle and message", () => {
      const err = new APITokenFormatError("Nada")

      expect(err.name).toBe("APITokenFormatError")
    })
  })
  describe("AuthorizationError", () => {
    it("provides defaults and detail", () => {
      const err = new AuthorizationError("Denied!")

      expect(err.name).toBe("AuthorizationError")
      expect(err.message).toBe("Denied!")
      expect(err.httpCode).toBe(403)
    })
  })
})
