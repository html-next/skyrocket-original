export default class Contract {

  constructor(options) {
    this.options = options;
  }

  static extend(options) {
    return new Contract(options);
  }

  static create(options) {
    return new Contract(options);
  }

}
