const Router = require('express')
const routes = new Router()
const Manufacturer = require('../../controllers/createDB/Manufactures')

routes.post('/create', Manufacturer.createManufacturer)

module.exports=routes