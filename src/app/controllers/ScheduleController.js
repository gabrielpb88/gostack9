const User = require('../models/User')
const Appointment = require('../models/Appointment')
const { Op } = require('sequelize')
const { parseISO, startOfDay, endOfDay } = require('date-fns')

class ScheduleController {
  async index (req, res) {
    const checkUserProvider = await User.findOne({ where: { id: req.userId, provider: true } })

    if (!checkUserProvider) {
      res.status(401).json({ error: 'User is not a provider' })
    }

    const { date } = req.query
    const parsedDate = parseISO(date)
    if (parsedDate.toString() === 'Invalid Date') {
      return res.status(400).json({ error: 'Invalid date' })
    }

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        }
      }
    })

    res.json(appointments)
  }
}

module.exports = new ScheduleController()
