const Router = require('express')
const routes = new Router()
const createDB = require('./RegLogUser')
const createManufacturer = require('./createManufacturer')
const User = require('../../controllers/createDB/User')
const authMiddleware = require('../../authMiddleware')
const userRoutes = require("./userRoutes")



routes.use('/auth', createDB)
routes.use('/manufacturer', createManufacturer)
routes.use('/user', authMiddleware, userRoutes, )
module.exports=routes
