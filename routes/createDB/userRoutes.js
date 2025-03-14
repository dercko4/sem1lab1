const Router = require('express')
const userRoutes = new Router()
const User = require('../../controllers/createDB/User')

userRoutes.post('/findOne', User.findOneUser)


module.exports=userRoutes