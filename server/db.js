const { Sequelize } = require('sequelize');

const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || '3306'

const dbName = process.env.DB_NAME || 'auth_db'
const dbUser = process.env.DB_USER || 'auth_user'
const dbPassword = process.env.DB_PASS || 'user123456'

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: parseInt(dbPort),
    dialect: 'mysql'

});

module.exports = sequelize