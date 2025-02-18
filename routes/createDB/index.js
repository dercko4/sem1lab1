const Router = require('express')
const routes = new Router()
const createDB = require('./RegLogUser')
const createManufacturer = require('./createManufacturer')
const User = require('../../controllers/createDB/User')
const authMiddleware = require('../../authMiddleware')

routes.use('/auth', createDB)
routes.use('/manufacturer', createManufacturer)
routes.patch('/user/patch', authMiddleware,User.changeProfile)
module.exports=routes