[![Stories in Ready](https://badge.waffle.io/runspired/ember-skyrocket.png?label=ready&title=Ready)](https://waffle.io/runspired/ember-skyrocket)
# Ember-skyrocket

Skyrocket is an attempt to utilize DOMless Ember and `fastboot` mechanisms to
provide a simple interface for building advanced multi-threaded applications.

Skyrocket wants to help you separate your app's major concerns.

- `data-threads` for data requests and processing
- `ui-threads` for pre-rendering
- `service-threads` for long running tasks
- `helper-threads` for parallel computing

As well, Skyrocket wants to bring the concept of the `route stack` to Ember
Applications, making it easy to bring native quality gestures and animations
to transitions.

You can read more about this idea here: http://blog.runspired.com/2015/06/05/using-webworkers-to-bring-native-app-best-practices-to-javascript-spas/

## Create a new worker

`ember g worker <worker-name>`

## Use your new new worker

`inject.worker('<worker-name>')`

## Terminology

The word "worker" is going to get thrown around a lot in this repo, here's a quick guide
to how the various contexts in which you will see and use it.

- `WebWorker`

This is a JS primitive with widespread platform support for spinning up extra threads to
do some work for your application.

- `SharedWorker`

This is a JS primitive with moderate platform support that allows a WebWorker instance to
be created and used by other WebWorkers in conjunction with the main thread.  This can be polyfilled via several different approaches.

- `ServiceWorker`

This is a JS primitive with minimal platform support that lets you spin up a single, long
lived thread to do work for your application.  This thread stays alive even when the browser/tab/window closes and allows you to do things such as deliver push notifications even while the browser is closed.  This cannot be polyfilled, but WebViews (such as electron, crosswalk, or cordova) can and have been extended to support it.

- `Worker`

A worker is a mental construct very similar in nature to a `service`.  It will have long 
lived state, and can have methods, properties, and events; all of which is accessible
via `Promises` or `Observables`.

- `Interface`

An interface is a mental construct very similar in nature to a `model`.  It defines 
various named properties of a worker, and what their type is.  For more on interfaces
see #1.

- `WorkerApplication`

This is the complete, compiled JS worker script.  This is not ever interacted with 
directly by an end user, it operates as an application shell binding the `Worker` to the
`Interface` and instantiating itself.  It's similar in nature to an Ember application
performing setup and initializing itself.


## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
