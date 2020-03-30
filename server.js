const express = require('express')

class App {
  constructor () {
    this.server = new express()
  }
}

module.exports = new App().server
