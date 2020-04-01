const Appointment = require('../models/Appointment')
const Yup = require('yup')
const User = require('../models/User')

class AppointmentController {
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

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    })

    return res.json(appointment)
  }
}

module.exports = new AppointmentController()
