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
