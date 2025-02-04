const Router = require('express')
const routes = new Router()
const Manufacturer = require('../../controllers/createDB/Manufactures')
const authMiddleware = require('../../authMiddleware')


routes.post('/create', Manufacturer.createManufacturer)
routes.get('/get', Manufacturer.selectManufacturers)
routes.patch('/patch', authMiddleware, Manufacturer.updateUser)
routes.delete('/delete', authMiddleware, Manufacturer.destroyUser)


module.exports=routes