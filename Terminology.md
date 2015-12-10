# Worker Terminology

### `WebWorker`

This is a JS primitive with widespread platform support for spinning up extra threads to
do some work for your application.

### `SharedWorker`

This is a JS primitive with moderate platform support that allows a WebWorker instance to
be created and used by other WebWorkers in conjunction with the main thread.

This may also refer to the extended version of `Worker` (see Worker below) that works with
`SharedWorkers`.

### `ServiceWorker`

This is a JS primitive with minimal platform support that lets you spin up a single, long
lived thread to do work for your application.  This thread stays alive even when the
browser/tab/window closes and allows you to do things such as deliver push notifications
even while the browser is closed.  This cannot be polyfilled, but WebViews (such as electron,
crosswalk, or cordova) can and have been extended to support it.

This may also refer to the extended version of `Worker` (see Worker below) that works with a
`ServiceWorker`.

### `Worker`

A worker is a mental construct very similar in nature to a `service`.  It will have long 
lived state, and can have methods, properties, and events; all of which are accessible
via `Promises`, `Observables` or other async primitives.  A Worker correlates underneath
to a WebWorker.

### `Interface`

An interface is a mental construct very similar in nature to a `model`.  It delineates 
various named properties and methods on a `Worker` which you will be able to interact
with via async Primitives.  When you `inject.worker('<worker-name>')` you are actually
injecting the interface to that `Worker`.

### `WorkerApplication`

This is the complete, compiled JS worker script.  This is not ever interacted with 
directly by an end user, it operates as an application shell binding the `Worker` to the
`Interface` and instantiating itself.  It's similar in nature to an Ember application
performing setup and initializing itself.

### `WorkerShell`

Much like WorkerApplication, you won't see or interact with a WorkerShell.  The WorkerShell
is an isolated scope and interface that mimics the scope and API surface of a WebWorker but
runs on the main thread.  This allows your worker code to still function on browsers that don't
support them.
