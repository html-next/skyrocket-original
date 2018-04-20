import Ember from 'ember';

const {
  computed,
  getOwner
} = Ember;

export default function injectWorker(name) {
  const fn = function(key) {
    const owner = getOwner(this);
    const service = owner.lookup('service:-skyrocket');
    const workerName = name || key;

    // TODO assert not camelized

    return service.lookup(workerName);
  };

  // eslint-disable-next-line ember-best-practices/require-dependent-keys
  return computed(fn);
}
