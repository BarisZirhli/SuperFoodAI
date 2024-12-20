const {
  DataTypes,
  Sequelize
} = require('sequelize');
const sequelize = require('../config/database');

class User extends Sequelize.Model {}

User.init({
  UserId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

module.exports = User;
// boy,kilo,yaş,cinsiyet