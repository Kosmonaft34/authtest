// @ts-check
require('dotenv').config()
const express = require('express') //commonjs
const { UsersModel, sequelize } = require('./user.model')
const app = express()
const port = process.env.PORT || 3000

app.get('/hello', (req, res) => {
    res.send('Hello world')
})

app.post('/login', (req, res) => {

})

app.post('/signup', (req, res) => {

})

// authentication - login + password = user credentials
// authorization - (права доступа к ресурсу) - token, cookie
// rbac- role based access control
// 1. Sessions (browser cookie sessinoId + sessionID in server DB) (redis cache)

// 2. JWT(jason web token) - либо cookie,либо localstorage, а на сервере tokenvalidation

async function start() {
    try {
      await sequelize.authenticate()
      await sequelize.sync()
      console.log('Successful db sync');
      app.listen(port)
    } catch (error) {
      console.error(error)
    }
  }
  
  start()