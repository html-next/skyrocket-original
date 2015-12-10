import Model from 'skyrocket/lib/worker-application';
import { module, test } from 'qunit';

module('worker-application', 'Unit | Model | worker application');

test('it exists', function(assert) {
  let model = Model;
  // let store = this.store();
  assert.ok(!!model);
});
