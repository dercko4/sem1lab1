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


    async selectManufacturers(req, res, next) {
        try {
            const allManufatrurers = await User.findAll()
            return res.json(allManufatrurers)
        } catch (error) {
            res.status(500).json({ message: "Что-то пошло не так" })
            console.log(error)
        }
    }

    async updateUser(req, res, next) {
        try {
            const id_user = req.user.id_user
            const { phone } = req.body.data
            const candidate = await User.findOne({ where: { id_user: id_user } })
            if (!candidate) return res.status(500).json({ message: "Не найден пользователь с таким id_user" })
            const newUser = await User.update({ phone: phone }, { where: { id_user: id_user } })
            return res.json({ message: `Пользователь с ID=${id_user} обновил телефон на ${phone}` })
        } catch (error) {
            res.status(500).json({ message: "Что-то пошло не так" })
            console.log(error)
        }
    }

    async destroyUser(req, res, next) {
        try {
            const id_user = req.user.id_user
            const candidate = await User.findOne({ where: { id_user: id_user } })
            if (!candidate) return res.status(500).json(("Не найден пользователь с таким id_user"));
            const destoryUser = await User.destroy({ where: { id_user: id_user } })
            return res.json({ message: `Вы уничтожили себя :). Ваш ID был: ${id_user}` })
        } catch (error) {
            res.status(500).json({ message: "Что-то пошло не так"})
            console.log(error)
        }
    }

}


module.exports = new CreateManufacturer()