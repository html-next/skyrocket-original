var features = {
  webSockets: !!self.webSockets,
  localStorage: !!self.localStorage,
  dedicatedWorkers: !!self.Worker,
  sharedWorkers: !!self.SharedWorker
};

Worker.addEventListener('message', function (event) {

  console.log('received event', event);
  var msg = event.data;

});
