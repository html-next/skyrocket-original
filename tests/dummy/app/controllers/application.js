import Ember from 'ember';
import injectWorker from 'skyrocket/inject';

const {
  computed,
  Controller
} = Ember;

export default Controller.extend({
  dataWorker: injectWorker('data-worker'),

  currentTime: computed.alias('dataWorker.currentTime'),

  init() {
    this._super();
    const dataWorker = this.get('dataWorker');
    dataWorker.startTimer({ duration: 30000 });
  }
});
