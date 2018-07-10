'use strict'
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class Promise {

  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.fulfilledQueue = []
    this.rejectedQueue = []

    const resolve = value => {
      setTimeout(() =>{
        if (this.state === PENDING) {
          this.state = FULFILLED
          this.value = value
          this.fulfilledQueue.forEach(cb => cb(this.value))
        }
      }, 0)
    }

    const reject = reason => {
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED
          this.reason = reason
          this.rejectedQueue.forEach(cb => cb(this.reason))
        }
      }, 0)
    }
    
    try {
      executor(resolve.bind(this), reject.bind(this))
    } catch(e) {
      this.state = REJECTED
      this.reason = e
    }
  }

  resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }

  reject(reason) {
    return new Promise((resolve, reject) =>{
      reject(reason)
    })
  }
}

module.exports = Promise