import Ember from 'ember';

export default Ember.Controller.extend({
  dataStore: Ember.inject.worker('data-store'),

  actions: {

    startUpload() {
      this.get('dataStore').upload({
        img: 'file://example.png'
      });
    },

    goOnline() {
      this.get('dataStore').trigger('online', { status: true });
    },

    goOffline() {
      this.get('dataStore').trigger('online', { status: false });
    }

  }

});
