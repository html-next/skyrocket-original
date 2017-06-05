import Ember from 'ember';

const {
  computed,
  getOwner
} = Ember;

export default function injectWorker(name) {

  const fn = function(key) {
    const owner = getOwner(this);
    const workerName = name || key;

    // TODO assert not camelized

    return owner.lookup(`worker:'${workerName}`);
  };

  // eslint-disable-next-line ember-best-practices/require-dependent-keys
  return computed(fn);
}
