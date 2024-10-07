const { Sequelize } = require('../../database')
const { User } = require('../../models/model')
const ApiError = require('../../ApiError')

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
                return next(ApiError.badRequest('Введите эл.почту, телефон и придумайте пароль'))
            }
            if (!passwordCheck) {
                return next(ApiError.badRequest('Введите пароль еще раз'))
            }
            if (password !== passwordCheck) {
                return next(ApiError.badRequest('Пароли не совпадают'))
            }
            let array
            if(!phone) {
                array = [email]
            }
            if(!email)
            {
                array = [phone]
            }
            if(email && phone){
                array = [email, phone]
            }
            const candidate = await User.findOne({
                where: { [Op.or]: array }
            })
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с такой почтой или телефоном уже существует'))
            }
            if (!passwordCheck) {
                return next(ApiError.badRequest("Повторно введите ваш пароль"))
            }
            if (password == passwordCheck) {
                const hashpassword = await bcrypt.hash(password, 5)
                const user = await User.create({
                    FIO, phone, email, password: hashpassword, address
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
            const {email, phone, password} = req.body
            if(!(email||phone)){          
                return next(ApiError.badRequest('Введите эл.почту / телефон и пароль'))
                }
            if(!password){    
                return next(ApiError.badRequest('Введите эл.почту / телефон и пароль'))
            }
            const obj={email,phone} //объект для динамического условия из-за возможности не вводить почту или телефон
            let condition = []
            condition = Object.entries(obj).reduce((accum,[key,value])=>{ //запись в accum пар [key,value]
                if(value) { //запись значений не являющихся undefined или null
                    accum[key]=value
                }
                return accum
            },{}) //используем объект как первичное значение accum
            console.log(condition)
    
            const user = await User.findOne({
                where:{[Op.or]:condition}
            })
            if(!user){
                return next(ApiError.internal('Введен неверный email/телефон или нет учётной записи'))
            }
    
            //Сравнение незашифрованного пароля password с зашифрованным user.password (password:hashpassword)
            let comparePassword = bcrypt.compareSync(password, user.password)
            if(!comparePassword){ //если пароли не совпадают
                return next(ApiError.internal("Указан неверный пароль"))
            }
            
            const token = generateJwt(user.id_user, user.role)
            return res.status(200).json({token})
        } catch (error) {
            next(ApiError.badRequest("Что-то пошло не так"))
            console.log(error)
        }
    }
}

module.exports=new CreateUser()