const Router = require('express')
const userRoutes = new Router()
const User = require('../../controllers/createDB/User')
const authMiddleware = require('../../authMiddleware')
const checkRoleMiddleWare = require('../../checkRoleMiddleWare')
const cacheMiddleware = require("../../cacheMiddleware")

userRoutes.post('/findOne', cacheMiddleware, User.findOneUser)
userRoutes.delete('/delete', checkRoleMiddleWare("admin"), User.destroyUser)
userRoutes.get('/getAll', checkRoleMiddleWare("admin"), User.findAllUsers)
userRoutes.patch('/patch', User.changeProfile)

module.exports = userRoutes