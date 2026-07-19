class Mutex {
  constructor() {
    this.queue = []
    this.locked = false
  }

  async acquire() {
    return new Promise((resolve) => {
      if (!this.locked) {
        this.locked = true
        resolve(() => this.release())
      } else {
        this.queue.push(resolve)
      }
    })
  }

  release() {
    if (this.queue.length > 0) {
      const nextResolve = this.queue.shift()
      nextResolve(() => this.release())
    } else {
      this.locked = false
    }
  }
}

// In-memory locks categorized by room types/categories
const bookingLocks = {
  deluxe: new Mutex(),
  standard: new Mutex(),
  budget: new Mutex(),
}

module.exports = { bookingLocks }
