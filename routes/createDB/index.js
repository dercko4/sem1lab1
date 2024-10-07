const Router = require('express')
const routes = new Router()
const createDB = require('./RegLogUser')
const createManufacturer = require('./createManufacturer')

routes.use('/auth', createDB)
routes.use('/manufacturer', createManufacturer)
module.exports=routes