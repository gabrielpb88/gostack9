const { Router } = require('express')

const authMiddleware = require('../src/app/middlewares/auth')

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')

const routes = new Router()

routes.get('/users', UserController.index)
routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)
routes.put('/users', UserController.update)

module.exports = routes
