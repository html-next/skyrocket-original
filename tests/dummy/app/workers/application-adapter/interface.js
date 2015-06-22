import Skyrocket from "skyrocket";

const {
  Event,
  Func,
  Prop,
  SendEvent
  };

export default Skyrocket.Interface.extend({

  myFunction: Func(),
  myProp: Prop(),
  myEvent: Event(),
  mySendEvent: SendEvent()

});
