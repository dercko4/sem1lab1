const sequelize = require('../database')
const {DataTypes} = require('sequelize')

const User = sequelize.define('users',{
    id_user: {type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
    FIO: {type: DataTypes.STRING, allowNull: true},
    phone: {type: DataTypes.INTEGER},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING, allowNull:true},
    role: {type: DataTypes.STRING, defaultValue: "user"},
    wallet: {type: DataTypes.FLOAT, defaultValue: "0"},
    address: {type: DataTypes.STRING}
})

const Product = sequelize.define('products',{
    id_product: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
    product_name: {type: DataTypes.STRING},
    expiration: {type: DataTypes.DATE},
    cost: {type: DataTypes.FLOAT},
    description: {type: DataTypes.STRING},
    quantity_in_warehouse: {type: DataTypes.FLOAT},
    
})

const Warehouse = sequelize.define('warehouses', {
    id_warehouse: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
    address: {type: DataTypes.STRING},
    capacity: {type: DataTypes.INTEGER}
})

const Manufacturer = sequelize.define('manufacturers', {
    id_manufacturer: {type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
    contry: {type: DataTypes.STRING},
    name_of_organization: {type: DataTypes.STRING}
})

const Category = sequelize.define('categories', {
    id_category: {type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
    category_name: {type: DataTypes.STRING},
    is_product_weight_category: {type: DataTypes.BOOLEAN}
})

const Basket_Product = sequelize.define('basket_products', {
    id_basket: {type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
    quantity_to_buy: {type: DataTypes.INTEGER}
})

const Order = sequelize.define('orders', {
    id_order: {type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
    full_cost: {type: DataTypes.FLOAT},
    status: {type: DataTypes.STRING}
})

User.hasMany(Order, {
    foreignKey: {
        name: 'id_user',
        type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4
    }
})
Order.belongsTo(User)

Manufacturer.hasMany(Product, {
    foreignKey: {
        name: 'id_product',
        type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4
    }
})
Product.belongsTo(Manufacturer)


Category.hasMany(Product, {
    foreignKey: {
        name: 'id_product',
        type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4
    }
})
Product.belongsTo(Category)

Warehouse.hasMany(Product, {
    foreignKey: {
        name: 'id_product',
        type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4
    }
})
Product.belongsTo(Warehouse)

Order.hasOne(Basket_Product, {
    foreignKey: {
        name: 'id_basket',
        type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4
    }
})
Basket_Product.belongsTo(Order)



module.exports={
    User,
    Product,
    Warehouse,
    Category,
    Basket_Product,
    Order
}