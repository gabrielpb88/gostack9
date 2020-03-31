const Express = require('express')
const routes = require('./routes')
const path = require('path')

require('./database')

class App {
  constructor () {
    this.server = new Express()

    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.server.use(Express.json())
    this.server.use('/files', Express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
  }

  routes () {
    this.server.use(routes)
  }
}

module.exports = new App().server
