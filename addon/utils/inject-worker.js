import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

const {
  computed
  } = Ember;

export default function lazyInjectWorker(name) {
  const fn = function() {
    return getOwner(this).lookup(`worker:'${name}`);
  };

  return computed(fn);
}
