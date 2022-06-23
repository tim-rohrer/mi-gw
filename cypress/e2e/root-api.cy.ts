describe("Root Level API", () => {
  describe("Requested route not found", () => {
    it.only("should return an error status", () => {
      cy.request({
        method: "GET",
        url: "/foo",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404)
        expect(response.body).to.equal("Sorry, can't find that!")
      })
    })
  })
})
