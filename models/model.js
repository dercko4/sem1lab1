const sequelize = require('../database')
const {DataTypes} = require('sequelize')

const User = sequelize.define('users',{
  id_user: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
  FIO: {type: DataTypes.STRING, allowNull: true},
  phone: {type: DataTypes.INTEGER},
  email: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING, allowNull:true},
  role: {type: DataTypes.STRING, defaultValue: "user"},
  wallet: {type: DataTypes.FLOAT, defaultValue: "0"},
  address: {type: DataTypes.STRING}
})

const Manufacturer = sequelize.define('manufacturers', {
  id_manufacturer: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
  contry: {type: DataTypes.STRING},
  name_of_organization: {type: DataTypes.STRING}
})

const Warehouse = sequelize.define('warehouses', {
  id_warehouse: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
  address: {type: DataTypes.STRING},
  capacity: {type: DataTypes.INTEGER}
})

const Category = sequelize.define('categories', {
  id_category: {type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
  category_name: {type: DataTypes.STRING},
  is_product_weight_category: {type: DataTypes.BOOLEAN}
})


const Product = sequelize.define('products',{
  id_product: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
  id_manufacturer: {type: DataTypes.UUID, references: {model: Manufacturer, key: 'id_manufacturer'}},
  id_category: {type: DataTypes.UUID, references: {model: Category, key: 'id_category'}},
  id_warehouse: {type: DataTypes.UUID, references: {model: Warehouse, key: 'id_warehouse'}},
  product_name: {type: DataTypes.STRING},
  expiration: {type: DataTypes.DATE},
  cost: {type: DataTypes.FLOAT},
  description: {type: DataTypes.STRING},
  quantity_in_warehouse: {type: DataTypes.FLOAT},
})


const Basket_Product = sequelize.define('basket_products', {
  id_basket: {type: DataTypes.UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
  id_product: {type: DataTypes.UUID, references: {model: Product, key: 'id_product'}},
  quantity_to_buy: {type: DataTypes.INTEGER}
})

const Order = sequelize.define('orders', {
  id_order: {type: DataTypes. UUID, primaryKey: true, defualtValue: sequelize.UUIDV4},
  id_basket: {type: DataTypes. UUID, references: {model: Basket_Product, key: 'id_basket'}},
  id_user: {type: DataTypes. UUID, references: {model: User, key: 'id_user'}},
  full_cost: {type: DataTypes.FLOAT},
  status: {type: DataTypes.STRING}
})

User.hasMany(Order)
User.hasMany(Basket_Product)

Manufacturer.hasMany(Product, {
  foreignKey: 'id_manufacturer',
})

Category.hasMany(Product, {
  foreignKey: 'id_category',
})

Warehouse.hasMany(Product, {
  foreignKey: 'id_warehouse',
})

Product.hasMany(Basket_Product, {
  foreignKey: 'id_product',
})

Order.hasOne(Basket_Product, {
  foreignKey: 'id_basket',
})


module.exports={
  User,
  Product,
  Warehouse,
  Category,
  Basket_Product,
  Order
}