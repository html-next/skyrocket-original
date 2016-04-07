/* global global, self, window */
const GLOBAL_ENV = typeof self !== 'undefined' ? self :
  (typeof global !== 'undefined' ? global :
    (typeof window !== 'undefined' ? window : false));

export default GLOBAL_ENV;
