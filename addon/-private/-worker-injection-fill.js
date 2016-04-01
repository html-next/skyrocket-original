import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

const {
  inject,
  computed
  } = Ember;

function lazyInjectWorker(name) {
  let [worker, label] = name.split(':');

  const fn = function lookupWorkerInstance() {
    let owner = getOwner(this);

    if (label) {
      let instanceName = `worker-instance:${worker}--${label}`;
      let instance = owner.lookup(instanceName);

      if (!instance) {
        let factory = owner._lookupFactory(`worker:${worker}`);

        instance = factory.create({
          label
        });

        owner.register(instanceName, instance);
      }

      return instance;
    }

    return owner.lookup(worker);
  };

  return computed(fn);
}

inject.worker = lazyInjectWorker;

export default lazyInjectWorker;
