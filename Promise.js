'use strict'

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const resolvePromise = (promise, x, resolve, reject) => {
  if (x === promise) throw new TypeError('Chaining cycle detected for promise')

  let called = false
  if (x instanceof Promise) {
    if (x.state === PENDING) {
      x.then(y => resolvePromise(promise, y, resolve, reject), err => reject(err))
    } else {
      x.then(resolve, reject)
    }
  } else if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
    try {
      const then = x.then

      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise, y, resolve, reject) 
        }, err => {
          if (called) return
          called = true
          reject(err)
        })
      } else {
        resolve(x)
      }

    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}
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
          this.fulfilledQueue.forEach(cb => cb())
        }
      }, 0)
    }

    const reject = reason => {
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED
          this.reason = reason
          this.rejectedQueue.forEach(cb => cb())
        }
      }, 0)
    }
    
    try {
      executor(resolve.bind(this), reject.bind(this))
    } catch(e) {
      reject(e)
    }
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new Promise((resolve, reject) =>{
      reject(reason)
    })
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
    const promise = new Promise((resolve, reject) => {
      const fulfillCb = () => {
        try {
          const value = onFulfilled(this.value)
          resolvePromise(promise, value, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }
      const rejectCb = () => {
        try {
          const reason = onRejected(this.reason)
          resolvePromise(promise, reason, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }
      if (this.state === FULFILLED) {
        setTimeout(fulfillCb, 0)
      } else if (this.state === REJECTED) {
        setTimeout(rejectCb, 0)
      } else if (this.state === PENDING) {
        this.fulfilledQueue.push(fulfillCb)
        this.rejectedQueue.push(rejectCb)
      }
    })
    return promise
  }

  catch(onRejected) {
    this.then(null, onRejected)
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise