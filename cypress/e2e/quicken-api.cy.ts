context("Quicken API", () => {
  let apiToken =
    "nCUYlC7G0I77FaZTm0skchNswhAJIdfC0WrUNMcnlsG5G2NDe2VYcyr1EcH52bKV"
  describe("GET /quicken", () => {
    it("should return an array of the Quicken data", () => {
      cy.request({
        method: "GET",
        url: "/quicken",
        qs: {
          apiToken,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an("array")
      })
    })
    it("should return an error if the API token is missing", () => {
      cy.request({
        method: "GET",
        url: "/quicken",
        qs: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.detail).to.equal(
          "Parameter apiToken: Invalid value.",
        )
      })
    })
    it("should return an error if the API token is not authorized", () => {
      apiToken =
        "Frj8cWKHwzIyXxDJmopv0Rx5yTOlvO6sbbQGR204SHQm9kDTru7LxQM2eXLumUTq"
      cy.request({
        method: "GET",
        url: "/quicken",
        qs: {
          apiToken,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403)
        expect(response.body).to.deep.equal({
          detail:
            "The presented API token does not permit you access to the requested service. Please request the additional authorization.",
          status: 403,
          title: "Forbidden",
          type: "about:blank",
        })
      })
    })
  })
  describe("POST /quicken-import", () => {
    it("should add a Quicken import to the MongoDB database", () => {
      const reqQuery = {
        apiToken:
          "nCUYlC7G0I77FaZTm0skchNswhAJIdfC0WrUNMcnlsG5G2NDe2VYcyr1EcH52bKV",
        data: ["string1", "string2"],
      }
      cy.quickenSaveImport(reqQuery).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).is.a("string")
      })
    })
    it("should handle a missing apiToken or data with proper error", () => {
      const reqQuery = {
        data: ["string1", "string2"],
      }
      cy.quickenSaveImport(reqQuery).then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.detail).to.equal(
          "Parameter apiToken: Invalid value.",
        )
      })
    })
    it("should handle an invalid apiToken", () => {
      const reqQuery = {
        apiToken:
          "invalidG0I77FaZTm0skchNswhAJIdfC0WrUNMcnlsG5G2NDe2VYcyr1EcH52bKV",
        data: ["string1", "string2"],
      }
      cy.quickenSaveImport(reqQuery).then((response) => {
        expect(response.status).to.equal(403)
        expect(response.body).to.deep.equal({
          detail:
            "The presented API token does not permit you access to the requested service. Please request the additional authorization.",
          status: 403,
          title: "Forbidden",
          type: "about:blank",
        })
      })
    })
  })
  describe("/GET most-recent-import", () => {
    let mostRecentTimestamp: Date
    beforeEach(() => {
      cy.database("reset").then(() =>
        cy
          .database("seedImports", {
            desiredNumberOfImportRecords: 5,
          })
          .then((data) => (mostRecentTimestamp = data)),
      )
    })
    it("should return the most recent of the imports", () => {
      const reqQuery = {
        apiToken:
          "nCUYlC7G0I77FaZTm0skchNswhAJIdfC0WrUNMcnlsG5G2NDe2VYcyr1EcH52bKV",
      }
      cy.quickenMostRecentImport(reqQuery).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body[0].createdTimestamp).to.equal(mostRecentTimestamp)
      })
    })
  })
})
