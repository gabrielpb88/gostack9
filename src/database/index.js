const Sequelize = require('sequelize')
const mongoose = require('mongoose')

const User = require('../app/models/User')
const File = require('../app/models/File')
const Appointment = require('../app/models/Appointment')

const databaseConfig = require('../config/database')

const models = [User, File, Appointment]

class Database {
  constructor () {
    this.init()
    this.mongoose()
  }

  init () {
    this.connection = new Sequelize(databaseConfig)

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }

  mongoose () {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL,
      { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  }
}

module.exports = new Database()
