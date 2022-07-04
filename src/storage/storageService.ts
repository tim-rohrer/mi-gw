import MongoDAOFactory from "./daos/MongoDAOFactory.js"

const quickenDAO = await new MongoDAOFactory().createQuickenDAO()

export { quickenDAO }
