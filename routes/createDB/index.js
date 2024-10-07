const Router = require('express')
const routes = new Router()
const createDB = require('./createDB')

routes.use('/auth', createDB)

module.exports=routes