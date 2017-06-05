let INSTANCE = null;

export default class WorkerShell {
  constructor(Klass, schema) {
    if (INSTANCE !== null) {
      throw new Error('WorkerShell must be a singleton instance. Attempted to instantiate multiple instances');
    }
    INSTANCE = this;
    this.schema = schema;
    this.instance = new Klass();
  }

  static getInstance() {
    return INSTANCE;
  }
}
