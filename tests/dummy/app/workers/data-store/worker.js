export default class WorkerApp {

  constructor(options) {
    this.options = options;
    this.user = {};
    this.friends = [];
  }

  fetch(url) {
    return {
      url,
      json: {
        hello: 'world!'
      }
    };
  }

  on(event, handler) {

  }

  trigger(eventName, eventData) {

  }

  upload(data) {

  }

  static create(options) {
    return new WorkerApp(options);
  }

}
