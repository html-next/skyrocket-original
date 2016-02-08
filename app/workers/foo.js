import { Worker, Primitives } from 'skyrocket';

const {
  method,
  event
  } = Primitives;

export default Worker.extend({
  myFunction: method(function() {

  }),
  myEvent: event({ outbound: false }, function() {

  }),
  mySendEvent: event({ inbound: false }, function() {

  })
});
