let instance;
class PubSub {
  constructor() {
    if(instance) {
      throw new Error('Error: Instantiation failed: Use PubSub.getInstance() instead of new.');
    }
    this.events = {};
  }
  
  static getInstance() {
      if (!instance) {
          instance = new PubSub();
      }
      return instance;
  }

  subscribe(event, callback) {
      if (!this.events[event]) {
          this.events[event] = [];
      }
      this.events[event].push(callback);
  }

  unsubscribe(event, callback) {
      if (!this.events[event]) return;

      this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  publish(event, data) {
      if (!this.events[event]) return;

      this.events[event].forEach(callback => callback(data));
  }
}

export default PubSub.getInstance();