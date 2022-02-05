// @ts-check
require('dotenv').config()
const bcryptjs = require('bcryptjs')
const bcrypt = require('bcryptjs/dist/bcrypt')
const { body, validationResult } = require('express-validator');
const express = require('express') //commonjs
const res = require('express/lib/response')
const { default: validator } = require('validator')
const { UsersModel, sequelize } = require('./user.model')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

app.get('/hello', (req, res) => {
  res.send('Hello world')
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body //получаем email, password пользователя извлекаем поля
  const userByEmail = await UsersModel.findOne({ where: { email } })//находим пользователя по  email в БД
  if (userByEmail) { //если нашли пользователя по email,то запускаем функцию сравнения хэшей паролей
    const plainedUser = userByEmail.get({ plain: true }) //plain: true - извлекаем данные пользователя в примитивной форме.
    if (await bcryptjs.compare(password, plainedUser.passwordhash)) { //bcryptjs.compare- передаём в неё пароль. Он её хэширует. И 2м параметром передаём passwordHash, который хранится в БД у пользователя он их должен сравнить если хэши одинаковые,то пароль верный
      res.send({ status: "Success" })
    } else {
      res.status(401).send({ status: "Incorrect credentials" })//если пароли не совпадают
    }
  } else { //если пользователь не найден в БД
    res.status(401).send({ status: "Incorrect credentials" })
  }
})

app.post('/signup',

  // (req, res, next) => { //midleeware функция валидатор
  //   const { email } = req.body //считываем email
  //   // if (email && /^\w+@\w+\.\w{1,3}$/.test(email)) {//проверяем,что email есть и проверяем,что он соответствуеь регулярке
  //   //после установки валидатора мы можем написать 
  //   if (validator.isEmail(email)) {
  //     next()
  //   } else {
  //     res.status(400).send({ status: "Incorrect email" })
  //   }
  // },
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    const { name, surname, birthday, email, password } = req.body //получаем пользователя извлекаем поля
    try {
      const passwordHash = await bcryptjs.hash(password, 10) //const passwordHash = await bcryptjs.hash(password, 10)
      const userByEmail = await UsersModel.findOne({ where: { email } })//перед тем, как создать пользователя проверяем,есть ли такой email в БД
      if (!userByEmail) { //если не существует,то создаём нового пользователя
        const newUser = await UsersModel.create({ name, surname, birthday, email, passwordHash }) //записываем в базу данных
        res.status(201).send(newUser) //возвращаем пользователю newUser и добавляем статус на серваке 201(статус создания на серваке данных)
      } else {
        res.status(400).send({ message: 'This email is not unique' })
      }

    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server Error' })
    }
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