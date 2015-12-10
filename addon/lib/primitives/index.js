import event from './event';
import method from './method';
import observable from './observable';
import snapshot from './snapshot';
import stream from './stream';

const k = function() {};

export default {
  event,
  method,
  observable,
  snapshot,
  stream,
  buffer: k
};
