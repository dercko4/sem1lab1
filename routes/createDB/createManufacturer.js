const Router = require('express')
const routes = new Router()
const Manufacturer = require('../../controllers/createDB/Manufactures')
const authMiddleware = require('../../authMiddleware')


routes.post('/create', Manufacturer.createManufacturer)


module.exports=routes