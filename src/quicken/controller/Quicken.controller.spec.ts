/** First time using @jest-mock/express. Worked great! */
import { jest } from "@jest/globals"
import { getMockReq, getMockRes } from "@jest-mock/express"
import QuickenController from "./Quicken.controller.js"
import quickenService from "../services/QuickenService"
import { ErrImpl, OkImpl } from "ts-results-es"
import { ParsedData } from "quicken-investment-parser/dist/QuickenInvestmentParser"

const { res, next, mockClear } = getMockRes()

describe("Quicken Controller", () => {
  beforeEach(() => mockClear())

  describe("/getData", () => {
    it("should succeed", async () => {
      const expectedResponse: ParsedData = [
        JSON.stringify({
          name: "Tim",
        }),
      ]
      const req = getMockReq()
      jest
        .spyOn(quickenService, "fetchQuickenInvestmentData")
        .mockResolvedValue(<OkImpl<ParsedData>>{
          ok: true,
          err: false,
          val: expectedResponse,
        })

      await QuickenController.getData(req, res, next)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith(expectedResponse)
    })
    it("should handle an error from the parser", async () => {
      const expectedResponse: Error = new Error("Something went wrong")
      const req = getMockReq()
      jest
        .spyOn(quickenService, "fetchQuickenInvestmentData")
        .mockResolvedValue(<ErrImpl<Error>>{
          ok: false,
          err: true,
          val: expectedResponse,
        })

      await QuickenController.getData(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expectedResponse)
    })
  })
})
