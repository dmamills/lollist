class Publisher {
  constructor() {
    this.events = {};
  }

  sub(eventName, cb) {
    if(!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(cb)
    return () => this.unsub(event, cb)
  }

  unsub(event, cb) {
    if(this.events[event]) {
      this.events[event] = this.events[event].filter(call => call !== cb);
    }
  }

  publish(event, data) {
    if(this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
};

module.exports = Publisher;