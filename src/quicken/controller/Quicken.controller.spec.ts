import { ParsedData } from "quicken-investment-parser/dist/QuickenInvestmentParser"

import { getMockReq, getMockRes } from "@jest-mock/express"
import { jest } from "@jest/globals"

import DbOperationError from "../../common/custom_errors/DbOperationError.js"

const mockFetchQuickenInvestmentData = jest.fn()
const mockStoreQuickenImport = jest.fn()

jest.unstable_mockModule("../services/quicken.service.js", () => ({
  fetchQuickenInvestmentData: mockFetchQuickenInvestmentData,
  storeQuickenImport: mockStoreQuickenImport,
}))

const quickenControllerModule = await import(
  "../controller/quicken.controller.js"
)

beforeEach(() => {
  jest.resetAllMocks()
})

test("fetchQuickenInvestmentData should succeed", async () => {
  const expectedResponse: ParsedData = [
    JSON.stringify({
      name: "Tim",
    }),
  ]
  mockFetchQuickenInvestmentData.mockImplementation(async () => ({
    ok: true,
    err: false,
    val: expectedResponse,
  }))
  const req = getMockReq()
  const { res, next } = getMockRes()

  await quickenControllerModule.getData(req, res, next)

  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith(expectedResponse)
})
test("fetchQuickenInvestmentData should handle an error from the parser", async () => {
  const expectedResponse: Error = new Error("Something went wrong")
  mockFetchQuickenInvestmentData.mockImplementation(async () => ({
    ok: false,
    err: true,
    val: expectedResponse,
  }))
  const req = getMockReq()
  const { res, next } = getMockRes()

  await quickenControllerModule.getData(req, res, next)

  expect(res.status).not.toHaveBeenCalled()
  expect(next).toHaveBeenCalledTimes(1)
  expect(next).toHaveBeenCalledWith(expectedResponse)
})

test("recordQuickenImport succeeds", async () => {
  const req = getMockReq({
    body: { data: ["string1", "string2"] },
  })
  const { res, next } = getMockRes()
  mockStoreQuickenImport.mockImplementation(async () => ({
    acknowledged: true,
    insertedId: "newObjectId",
  }))

  await quickenControllerModule.recordQuickenImport(req, res, next)

  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(200)
})

test("recordQuickenImport doesn't get a write ack", async () => {
  const expectedResponse = new DbOperationError(
    "The database write was not acknowledged. Please investigate and try again.",
  )
  const req = getMockReq({
    body: { data: ["string1", "string2"] },
  })
  const { res, next } = getMockRes()
  mockStoreQuickenImport.mockImplementation(async () => ({
    acknowledged: false,
  }))

  await quickenControllerModule.recordQuickenImport(req, res, next)

  expect(res.status).not.toHaveBeenCalled()
  expect(next).toHaveBeenCalledTimes(1)
  expect(next).toHaveBeenCalledWith(expectedResponse)
})

test("recordQuickenImport handles unknown thrown error", async () => {
  const req = getMockReq()
  const { res, next } = getMockRes()
  mockStoreQuickenImport.mockImplementation(() =>
    Promise.reject(new Error("Unexpected error!")),
  )

  await quickenControllerModule.recordQuickenImport(req, res, next)

  expect(res.status).not.toHaveBeenCalled()
  expect(next).toHaveBeenCalledWith(new Error("Unexpected error!"))
})
