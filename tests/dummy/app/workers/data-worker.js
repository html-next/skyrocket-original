import {
  signal,
  prop
} from 'skyrocket/decorators';

export default class DataWorker {
  constructor() {
    this._running = false;
    this._currentTime = 0;
    this.options = null;
  }

  tick() {
    this.currentTime += this.options.duration;
  }

  scheduleTick() {
    setTimeout(() => {
      this.tick();
    }, this.options.duration);
  }

  @signal
  startTimer(options = {}) {
    if (this._running === true) {
      return;
    }

    options.duration = options.duration || 1000;

    this.running = true;
    this.options = options;
    this.currentTime = 0;
    this.scheduleTick();
  }

  @prop
  get running() {
    return this._running;
  }
  set running(v) {
    this._running = v;
  }

  @prop
  get currentTime() {
    return this._currentTime;
  }
  set currentTime(v) {
    this._currentTime = v;
  }
}

