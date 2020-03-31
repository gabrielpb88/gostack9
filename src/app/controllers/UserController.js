const User = require('../models/User')
const Yup = require('yup')

class UserController {
  async index (req, res) {
    return res.json((await User.findAll()).map(user => {
      const { id, name, email, provider } = user
      return { id, name, email, provider }
    }))
  }

  async store (req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    const userExists = await User.findOne({ where: { email: req.body.email } })
    if (userExists) {
      return res.status(400).json({ error: 'Email already exists.' })
    }
    const { id, name, email, provider } = await User.create(req.body)
    return res.json({ id, name, email, provider })
  }

  async update (req, res) {
    const userSchema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      oldPassword: Yup.string()
        .when('password', (password, field) => password ? field.required() : field),
      password: Yup.string().min(6),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    })

    try {
      await userSchema.validate(req.body, { abortEarly: false })
    } catch (error) {
      return res.status(400).json(error.errors)
    }

    const { email, oldPassword } = req.body

    const user = await User.findByPk(req.userId)

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email: req.body.email } })
      if (userExists) {
        return res.status(400).json({ error: 'Email already exists.' })
      }
    }

    if (oldPassword && await user.checkPassword(oldPassword)) {
      return res.status(401).json({ error: 'Password does not match' })
    }

    const { id, name, provider } = await user.update(req.body)

    return res.json({ id, name, email, provider })
  }
}

module.exports = new UserController()
