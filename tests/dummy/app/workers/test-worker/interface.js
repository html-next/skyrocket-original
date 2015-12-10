import { Interface, Primitives as P } from 'skyrocket';

export default Interface.extend({
  myFunction: P.method(),
  myProp: P.snapshot(),
  myEvent: P.event({ outbound: false }),
  mySendEvent: P.event({ inbound: false })
});
