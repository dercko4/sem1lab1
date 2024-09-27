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
    id_manufacturer: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4, references: {model: 'manufacturers', foreignKey: 'id_manufacturer'}},
    id_category: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4, references: {model: 'categories', foreignKey: 'id_category'}},
    id_warehouse: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4, references: {model: 'warehouses', foreignKey: 'id_warehouse'}},
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
    id_product: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4, references: {model: 'products', foreignKey: 'id_product'}},
    quantity_to_buy: {type: DataTypes.INTEGER}
})

const Order = sequelize.define('orders', {
    id_order: {type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
    id_user: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4, references: {model: 'users', foreignKey: 'id_user'}},
    id_basket: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4, references: {model: 'basket_products', foreignKey: 'id_basket'}},
    full_cost: {type: DataTypes.FLOAT},
    status: {type: DataTypes.STRING}
})

User.hasMany(Order)

Manufacturer.hasMany(Product)
Category.hasMany(Product)
Warehouse.hasMany(Product)

Order.hasOne(Basket_Product)


module.exports(
    User,
    Product,
    Warehouse,
    Category,
    Basket_Product,
    Order
)