const User = require('../models/User')
const Notification = require('../schemas/Notification')

class NotificationController {
  async index (req, res) {
    const checkIsProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true
      }
    })

    if (!checkIsProvider) {
      return res.status(401).json({ error: 'Only provider can load notifications' })
    }

    const notifications = await Notification.find({
      user: req.userId
    }).sort({
      createdAt: 'desc'
    }).limit(20)

    res.json(notifications)
  }

  async update (req, res) {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { read: true },
      { new: true }
    )

    if (!notification) {
      return res.status(400).json({ error: 'Notification not found or this notification doesn`t belongs to the logged user' })
    }

    res.json(notification)
  }
}

module.exports = new NotificationController()
