const Promise = require('../Promise')

const promise1 = new Promise((resolve, reject) => {
  // setTimeout(() => {
  //   resolve(111)
  // }, 1000)
  setTimeout(() => {
    resolve(222)
  }, 500)
})

const promise2 = promise1.then(() => {
  return new Promise((resolve, reject) => {
    // setTimeout(() => {
    //   resolve(111)
    // }, 1000)
    resolve(111)
  })
})

setTimeout(() => {
  console.log(promise1, promise2)
}, 2000)

// console.log(promise1, promise2)