import { Contract, Primitives } from 'skyrocket';

const {
  method,
  event,
  snapshot,
  array,
  object,
  task
  } = Primitives;

export default Contract.create({
  fetch: method(),
  message: event(),
  forceLogout: event({ outbound: false }),
  online: event({ inbound: false }),
  status: snapshot({ defaultValue: false }),
  upload: task(),
  user: object(),
  friends: array()
});
