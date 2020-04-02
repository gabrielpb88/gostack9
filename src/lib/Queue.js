const Bee = require('bee-queue')
const CancellationMail = require('../app/jobs/CancellationMail')
const configRedis = require('../config/redis')

const jobs = [CancellationMail]

class Queue {
  constructor () {
    this.queues = {}

    this.init()
  }

  init () {
    jobs.forEach(job => {
      const { key, handle } = job
      this.queues[key] = {
        bee: new Bee(key, {
          redis: configRedis
        }),
        handle
      }
    })
  }

  /**
   * Add a Job to the Queue
   * @param {String} queue Name of the queue
   * @param {Job} job The job to be added to the queue
   */
  add (queue, job) {
    return this.queues[queue].bee.createJob(job).save()
  }

  processQueue () {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key]

      bee.process(handle)
    })

    console.log('A fila executou')
  }
}

module.exports = new Queue()
