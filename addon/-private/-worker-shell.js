import Transport from './-worker-transport';

const OWNER = Symbol('-worker-owner');

export default class WorkerShell {

  constructor(options) {
    this.transport = new Transport({
      isWorker: true
    });

    this.instance = options.worker.create({
      [OWNER]: this
    });

    this.contract = options.contract.create({
      transport: this.transport,
      instance: this.instance
    });
  }

  static create(options) {
    return new WorkerShell(options);
  }

}
