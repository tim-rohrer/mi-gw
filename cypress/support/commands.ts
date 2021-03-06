// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("database", (operation, actionData) =>
  cy
    .task(`${operation}:database`, {
      url: "mongodb://root:example@localhost:27017",
      actionData,
    })
    .then((data) => data),
)

Cypress.Commands.add("quickenSaveImport", (apiToken) =>
  cy
    .request({
      method: "POST",
      url: "/quicken/store-import",
      qs: apiToken,
      failOnStatusCode: false,
    })
    .then((response) => response),
)

Cypress.Commands.add("quickenMostRecentImport", (apiToken) =>
  cy
    .request({
      method: "GET",
      url: "/quicken/most-recent-import",
      qs: apiToken,
      failOnStatusCode: false,
    })
    .then((response) => response),
)
