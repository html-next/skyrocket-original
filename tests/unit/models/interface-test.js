import Model from 'skyrocket/lib/interface';
import { module, test } from 'qunit';

module('interface', 'Unit | Model | interface');

test('it exists', function(assert) {
  let model = Model;
  // let store = this.store();
  assert.ok(!!model);
});
