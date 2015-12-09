# Skyrocket
## Project Overview | Stage 1

### Table of Contents

1. [Overview](#overview)
2. [Usage](#usage)
  1. [Generating a Worker](#generating-a-worker)
  2. [Creating the Worker](#creating-the-worker)
  3. [Worker Primitives](#worker-primitives)
  4. [Using a Worker](#using-a-worker)

### Overview
Skyrocket is an attempt to eliminate the friction of building and using Workers, unlocking applications that consistently function at 60fps even in the most advanced use cases in hostile environments.

Skyrocket wants to help you separate your app's major concerns.
- data-threads for data requests and processing
- ui-threads for pre-rendering
- service-threads for long running tasks
- helper-threads for parallel computing

It additionally aims to utilize DOMless Ember and fastboot’s rehydration mechanisms to provide a simple interface for assisting in expensive render situations.

Links
- [Introductory Blog Post](http://blog.runspired.com/2015/06/05/using-webworkers-to-bring-native-app-best-practices-to-javascript-spas/)
- [Svelte Render Slides](https://www.icloud.com/keynote/000986KRR2MbigmRrR2znkvQg#svelte-renders)
- [Pokedex (by Nolan Lawson)](https://www.pokedex.org/)
- [Pokedex Implementation Blog Post](http://www.pocketjavascript.com/blog/2015/11/23/introducing-pokedex-org)


### Usage

#### Generating a Worker

`ember g worker foo`
```
/app/workers/foo/
              interface.js
              worker.js
```

`ember g shared-worker foo`
```
/app/workers/foo/
              interface.js
              worker.js
```

`ember g service-worker`
```
/app/service-worker/
              interface.js
              worker.js
```

*Reach Goal: Eventually, additional worker blueprints may be created for workers devoted to specific types of behavioral needs, such as access to the data store, a SimpleDom instance, or an entire app-instance.*

#### Creating the Worker

The Interface is like a Model for your Worker, it declares the various asynchronous
primitives the worker and your app will be using to communicate, and is used to
generate a Service-like object in your app through which to do so.

```js
import { Interface, Primitives: p } from 'skyrocket';

export default Interface.extend({
  foo: p.snapshot(),
  bar: p.method(),
  baz: p.event({ outbound: false }), // specify an inbound (to the main thread) only event
  spam: p.event({ inbound: false }), // specify an outbound (to the worked) only event
  eggs: p.stream(),
  ham: p.observable()
});
```

The Worker is the stand alone mini-application that will be created when an Interface is instantiated.
It should implement the primitives that the Interface defines.

```js
import { Worker } from 'skyrocket';
import interface from './interface';

export default Worker.extend({
  interface: interface,
  foo: 'hello world',
  bar() {
    // do something
  },
  onSpam: on('spam', function() {})
});
```

#### Worker Primitives

Snapshot
- `Primitive.snapshot()` is the last known value of a property within the worker.
- Snapshots will update as quickly as possible, but they do not necessarily represent the current state of the value within the worker.

Method
- `Primitive.method()` specifies a method on the worker you are capable of invoking from the main thread.  You will always receive a promise that resolves with the final outcome returned by the method, or rejects with an error thrown by it.
- Promises returned from the method in the worker which is invoked will be waited on their outcome is what will be returned to the main thread.

Event
- `Primitive.event()` specifies an event that you can either trigger on the worker or listen for from the worker.  By default, an event is allowed to go either way (a worker can trigger it or the app can trigger it), but you can restrict the direction by setting inbound/outbound to true/false as desired.
- To send an event
  - to a worker: `interface.trigger(‘<event-name>’, <event>)`
  - from a worker: `this.trigger(‘<event-name>’, <event>)`
- To receive an event
  - `on(‘<event-name>’, (event) => {})`
- when you trigger an event, it triggers both in the app and in the worker and vice-versa

Observable
- https://egghead.io/lessons/javascript-introducing-the-observable
- https://github.com/Reactive-Extensions/RxJS
- http://reactivex.io/documentation/observable.html
- https://github.com/zenparsing/es-observable

Stream
- https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API

Buffer?
- not all stream sources buffer the same way:
  - https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
- pretty good tutorial on streaming/buffering
  - http://blog.wirewax.com/building-a-media-source-html5-player-with-adaptive-streaming-25/

#### Using a Worker
You use a worker much like you would use a service.
```js
export default Component.extend({
  geolocation: inject.worker('geolocation'),
  latitude: computed.alias('geolocation.latitude'),
  getSomeData() {
    return this.get('geolocation')
      .doFooThing()
      .then((data) => {
        // do something with data
      });
  }
});
```

Except for your ServiceWorker, you can use more than one instance of a worker if needed.
```js
inject.worker('foo')  // uses foo:main
inject.worker('foo:main') // looks up an instance of worker 'foo' named 'main', instantiates if needed.
inject.worker('foo:bar') // looks up an instance of worker 'foo' named 'bar', instantiates if needed.
```
