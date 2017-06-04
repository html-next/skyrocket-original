import Ember from 'ember';

const {
  computed,
  getOwner
} = Ember;

export default function lazyInjectWorker(name) {
  const fn = function(key) {
    const owner = getOwner(this);
    const workerName = name || key;

    // TODO assert not camelized

    return owner.lookup(`worker:'${workerName}`);
  };

  return computed(fn);
}
