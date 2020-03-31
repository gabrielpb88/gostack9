const { Router } = require('express')
const User = require('./src/app/models/User')

const routes = new Router()

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Gabriel Pereira Bastos',
    email: 'gabrielpb88@gmail.com',
    password_hash: '123'
  })
  return res.json(user)
})

module.exports = routes
