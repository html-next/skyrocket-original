import Ember from 'ember';

const {
  Object: Obj,
  Evented
  } = Ember;

export default Obj.extend(Evented, {
  _isWorkerFactory: true
});
