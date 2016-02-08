import { Interface, Primitives } from 'skyrocket';

const {
  method,
  event
  } = Primitives;

export default Interface.extend({
  myFunction: method(),
  myEvent: event({ outbound: false }),
  mySendEvent: event({ inbound: false })
});
