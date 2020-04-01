const { Router } = require('express')
const multer = require('multer')
const multerConfig = require('./config/multer')

const authMiddleware = require('../src/app/middlewares/auth')

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')
const FileController = require('./app/controllers/FileController')
const ProviderController = require('./app/controllers/ProviderController')
const AppointmentController = require('./app/controllers/AppointmentController')

const routes = new Router()
const upload = multer(multerConfig)

routes.get('/users', UserController.index)
routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)
routes.put('/users', UserController.update)

routes.post('/files', upload.single('file'), FileController.store)
routes.post('/appointments', AppointmentController.store)
routes.get('/providers', ProviderController.index)

module.exports = routes
