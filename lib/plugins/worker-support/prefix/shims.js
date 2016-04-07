
define('ember', [], function() {
  'use strict';

  return { 'default': Ember };
});

define('rsvp', [], function() {
  'use strict';

  return { 'default': Ember.RSVP, 'Promise': Ember.RSVP.Promise };
});
