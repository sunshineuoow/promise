const Promise = require('../Promise')

const promise1 = new Promise((resolve, reject) => {
  throw new Error('aaaa')
})

console.log(promise1)