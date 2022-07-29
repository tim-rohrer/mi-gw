declare namespace Cypress {
  type TaskData = string | Record<string, any>

  interface Chainable {
    database(operation: string)
    database(operation: string, TaskData): any
    quickenSaveImport(apiToken)
    quickenMostRecentImport(apiToken)
  }
}
