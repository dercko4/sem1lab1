const { Sequelize } = require('../../database')
const { User} = require('../../models/model')
const ApiError = require('../../ApiError')
const { Op }= require("sequelize");
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

const generateJwt = (id_user, role) => {
    return jwt.sign(
        {id_user, role},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
}


class CreateUser {
    async registration(req, res, next) {
        try {
            const { FIO, phone, email, password, passwordCheck, address} = req.body
            if (!email&password || !phone&password) {
                return next(ApiError.badRequest('Введите эл.почту или телефон, а затем придумайте пароль'))
            }
            if (!passwordCheck) {
                return next(ApiError.badRequest('Введите пароль еще раз'))
            }
            if (password !== passwordCheck) {
                return next(ApiError.badRequest('Пароли не совпадают'))
            }
            let candidate
            if(!phone){
                candidate = await User.findOne({where: {email: email}})
            }
            if(!email)
            {   
                candidate = await User.findOne({where: {phone:phone}})
            }
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с такой почтой уже существует'))
            }
            
            if (!passwordCheck) {
                return next(ApiError.badRequest("Повторно введите ваш пароль"))
            }
            let passwordHash = await bcrypt.hash(password, 5)
            if (password == passwordCheck) {
                const user = await User.create({
                    id_user: uuid.v4() ,FIO, phone, email, password: passwordHash, address
                })
                const token = generateJwt(user.id_user, user.role)
                return res.json({token})
            }
            else return next(ApiError.badRequest('Пароли не совпадают'))

        }
        catch (error) {
            next(ApiError.badRequest("Что-то пошло не так"))
            console.log(error)
        }
    }

    async login(req,res,next){
        try {
            const { email, password } = req.body
            if (!email) {
                res.status(500).json({message: 'Email должен быть не пустым!'})
                return
            }
            if (!password) {
                res.status(500).json({message: 'Пароль должен быть не пустым!'})
                return
            }
            const user = await User.findOne({ where: { email } })
            if (!user) {
                res.status(500).json({message: 'Пользователь не найден!'})
                return
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                res.status(500).json({message: "Пароли не совпадают!"})
                return
            }
            const token = generateJwt(user.id_user, user.role)
            res.json({ token })
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Что-то пошло не так"})
            return
        }
    }
}

module.exports= new CreateUser()
