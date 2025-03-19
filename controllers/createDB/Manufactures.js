const { Sequelize } = require('../../database')
const { Manufacturer, User } = require('../../models/model')
const ApiError = require('../../ApiError')
const uuid = require('uuid')


class CreateManufacturer {
    async createManufacturer(req, res, next) {
        try {
            const { contry, name_of_organization } = req.body
            if (!contry || !name_of_organization) {
                return res.status(500).json({ message: "Введите полностью данные" })
            }
            const manufacturer = await Manufacturer.create({ id_manufacturer: uuid.v4(), contry, name_of_organization })
            return res.json({ message: "Производитель создан" })
        } catch (error) {
            res.status(500).json({ message: "Что-то пошло не так" })
            console.log(error)
        }
    }

}


module.exports = new CreateManufacturer()