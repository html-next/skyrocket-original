export default class WorkerInterface {
  constructor(WorkerClass, WorkerSchema) {
    this.worker = new WorkerClass();
    this.schema = WorkerSchema;

    this.connect();
  }

  receive() {

  }

  send() {

  }

  connect() {

  }
}
