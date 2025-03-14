const { Sequelize, where } = require('../../database')
const { User } = require('../../models/model')
const ApiError = require('../../ApiError')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

const generateJwt = (id_user, role) => {
    return jwt.sign(
        { id_user, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

function removeEmpty(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != ''));
}


class CreateUser {
    async registration(req, res, next) {
        try {
            const { FIO, phone, email, password, passwordCheck, address } = req.body
            if (!email & password || !phone & password) {
                return res.status(500).json({ message: 'Введите эл.почту или телефон, а затем придумайте пароль' })
            }
            if (!passwordCheck) {
                return res.status(500).json({ message: 'Введите пароль еще раз' })
            }
            if (password !== passwordCheck) {
                return res.status(500).json({ message: 'Пароли не совпадают' })
            }
            let candidate
            if (!phone) {
                candidate = await User.findOne({ where: { email: email } })
            }
            if (!email) {
                candidate = await User.findOne({ where: { phone: phone } })
            }
            if (candidate) {
                return res.status(500).json({ message: 'Пользователь с такой почтой уже существует' })
            }

            if (!passwordCheck) {
                return res.status(500).json({ message: "Повторно введите ваш пароль" })
            }
            let passwordHash = await bcrypt.hash(password, 5)
            if (password == passwordCheck) {
                const user = await User.create({
                    id_user: uuid.v4(), FIO, phone, email, password: passwordHash, address
                })
                const token = generateJwt(user.id_user, user.role)
                return res.json({ token: token })
            }
            else return res.status(500).json({ message: 'Пароли не совпадают' })

        }
        catch (error) {
            res.status(500).json({ message: "Что-то пошло не так" })
            console.log(error)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email) {
                res.status(500).json({ message: 'Email должен быть не пустым!' })
                return
            }
            if (!password) {
                res.status(500).json({ message: 'Пароль должен быть не пустым!' })
                return
            }
            const user = await User.findOne({ where: { email } })
            if (!user) {
                res.status(500).json({ message: 'Пользователь не найден!' })
                return
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                res.status(500).json({ message: "Пароли не совпадают!" })
                return
            }
            const token = generateJwt(user.id_user, user.role)
            res.json({ token: token })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Что-то пошло не так" })
            return
        }
    }

    async changeProfile(req, res, next) {
        try {
            const id_user = req.user.id_user
            const { FIO: FIO, phone: phone, email: email, address: address, password: password, checkPassword: checkPassword } = req.body.data
            const updatedUser = await User.update({ FIO: FIO, phone: phone, email: email, address: address, password: password, checkPassword: checkPassword }, { where: { id_user } })
        } catch (error) {
            console.log(error)
            return
        }

    }

    async findAllUsers(req, res, next) {
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
            res.status(500).json({ message: "Что-то пошло не так" })
            console.log(error)
        }
    }

    async findOneUser(req, res, next) {
        try {
            const id_user = req.user.id_user
            const user = await User.findOne({where: {id_user}})
            res.json(user)
        } catch (error) {
            res.status(500).json({ message: "Что-то пошло не так" })
            console.log(error)
        }
    }
}

module.exports = new CreateUser()
