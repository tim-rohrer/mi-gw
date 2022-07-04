import * as StorageService from "../storageService.js"

test.only("MongoQuickenDAO returned from factory with collection defined connection", async () => {
  expect(StorageService.quickenDAO).toHaveProperty("quicken")
})
