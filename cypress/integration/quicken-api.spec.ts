describe("Quicken API", () => {
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
        console.log(response.body)
        expect(response.body).to.deep.equal({
          detail: "Your request was missing a proper API Token.",
          status: 400,
          title: "Malformed or missing API Token",
          type: "/errors/api-token-format-error",
        })
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
})
