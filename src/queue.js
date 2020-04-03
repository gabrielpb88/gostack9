require('dotenv/config')

const Queue = require('./lib/Queue')

console.log('Fila rodando')
Queue.processQueue()
