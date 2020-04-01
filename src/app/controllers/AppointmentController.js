const Appointment = require('../models/Appointment')
const Yup = require('yup')
const { startOfHour, parseISO, isBefore } = require('date-fns')
const User = require('../models/User')
const File = require('../models/File')

class AppointmentController {
  async index (req, res) {
    const { page = 1, limit = 20 } = req.query

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null
      },
      attributes: ['id', 'date'],
      limit,
      offset: (page - 1) * limit,
      order: ['date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url']
            }
          ]
        }
      ]
    })
    res.json(appointments)
  }

  async store (req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    })

    const { provider_id, date } = req.body

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (error) {
      return res.status(400).json(error.errors)
    }

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    })

    if (!isProvider) {
      return res.status(401).json({ error: `provider_id: '${provider_id}' is not a provider` })
    }

    const hourStart = startOfHour(parseISO(date))

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' })
    }

    const hourNotAvailable = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    })

    if (hourNotAvailable) {
      return res.status(400).json({ error: 'Appointment date is not available' })
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    })

    return res.json(appointment)
  }
}

module.exports = new AppointmentController()
