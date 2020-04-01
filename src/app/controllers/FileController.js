const File = require('../models/File')
const User = require('../models/User')

class FileController {
  async store (req, res) {
    const { originalname: name, filename: path } = req.file

    const file = await File.create({
      name,
      path
    })

    const user = await User.findOne({ where: { id: req.userId } })
    user.avatar_id = file.id
    await user.save()

    return res.json(file)
  }
}

module.exports = new FileController()
