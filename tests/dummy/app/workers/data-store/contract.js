import { Contract } from 'skyrocket';
import { method, event, snapshot, array, object, task } from 'skyrocket/primitives';

export default Contract.extend({
  fetch: method(),
  message: event(),
  forceLogout: event({ outbound: false }),
  online: event({ inbound: false }),
  status: snapshot({ defaultValue: false }),
  upload: task(),
  user: object(),
  friends: array()
});
