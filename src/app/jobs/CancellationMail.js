const Mail = require('../../lib/Mail')
const { format } = require('date-fns')
const { ptBR } = require('date-fns/locale')

class CancellationMail {
  get key () {
    return 'CancelationMail'
  }

  /**
   * Action to be performed in the queue
   * @param {Appointment} param0 - Object with info used by the inner sendMail method
   */
  async handle ({ data }) {
    const { appointment } = data

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          appointment.date,
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          { locale: ptBR }
        )
      }
    })
  }
}

module.exports = new CancellationMail()
