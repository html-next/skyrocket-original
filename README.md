Skyrocket
=========

[![npm version](https://badge.fury.io/js/skyrocket-engine.svg)](http://badge.fury.io/js/skyrocket-engine)
[![Build Status](https://travis-ci.org/runspired/skyrocket.svg)](https://travis-ci.org/runspired/skyrocket)
[![Ember Observer Score](http://emberobserver.com/badges/skyrocket.svg)](http://emberobserver.com/addons/skyrocket)

Skyrocket enables you to build multi-threaded applications, helping you create apps
 that consistently function at 60fps even in the most advanced use cases in hostile environments.

- [Overview](./OVERVIEW.md)
- [Terminology Guide](./Terminology.md)


## Installation

`ember install skyrocket-engine`


## Usage


### Scaffolding A Worker

```cli
ember g worker data-store
```

Produces the following:
```cli
  /app/workers/data-store/
     interface.js
     worker.js
```

When building or serving your ember application, this worker will be built as
as stand alone file located at `/assets/workers/data-store.js`.

### Imports

Currently any module from your `app`, from an `addon`, and `Ember` can be imported.

### Restrictions

Importing from `bower_components` and non-addons is not currently possible, nor is
 the Browser environment currently shimmed.  In the near future, you will be able
 to provide your worker a browser shim as well.
 
 
 
## Creating Your First Worker

### The interface

The interface is a "model" of your Worker's exposed API.  It represents the
asynchronous methods, events, and properties (called snapshots) which will be available
to your app.

```js
import { Interface, Primitives:p } from 'skyrocket';

export default Interface.extend({
  foo: p.snapshot(),
  bar: p.method(),
  baz: p.event({ outbound: false }), // specify an inbound (to the main thread) only event
  spam: p.event({ inbound: false }) // specify an outbound (to the worked) only event
});
```

### The worker

The Worker is the stand alone mini-application that will be created when an Interface is instantiated.
It should implement the primitives that the Interface defines.

```js
import { Worker } from 'skyrocket';
import api from './interface';

export default Worker.extend({
  'interface': api,

  // foo is a property, but also a snapshot.
  // whenever foo updates, it's new state will
  // be updated on the app
  foo: 'hello world',

  // bar can be invoked from app
  // it's return can be a value or a promise
  bar() {
    this.send('baz', {}); // send the baz event to the app
  },
  onSpam: on('spam', function() {}) // do something when the worker receives the spam event
});
```


## Using Your Worker


## Fastboot

We'll make it work by 0.2.x


## Support, Questions, Collaboration

Join the [skyrocket](https://embercommunity.slack.com/messages/skyrocket/) channel on Slack.

[![Slack Status](https://ember-community-slackin.herokuapp.com/badge.svg)](https://ember-community-slackin.herokuapp.com/)


## Status

[Changelog](./CHANGELOG.md)

[![dependencies](https://david-dm.org/runspired/liquid-fire-tweenlite.svg)](https://david-dm.org/runspired/liquid-fire-tweenlite)
[![devDependency Status](https://david-dm.org/runspired/liquid-fire-tweenlite/dev-status.svg)](https://david-dm.org/runspired/liquid-fire-tweenlite#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/runspired/skyrocket/badge.svg?branch=master&service=github)](https://coveralls.io/github/runspired/skyrocket?branch=master)


## Contributing

Contributions are very welcome, when making a PR please try to use the following conventions:

** Commit Messages: ** [angular-style](https://github.com/angular/angular.js/blob/v1.4.8/CONTRIBUTING.md#commit)

`<type>(<scope>): <title>`

Examples:

- chore(deps): bump deps in package.json and bower.json
- docs(component): document the `fast-action` component

**Branch Naming:**

`<type>/<short-description>`

Examples:

- chore/bump-deps
- docs/foo-component-usage


## Funding

OSS is often a labor of love. Skyrocket is largely built with that love.

<a href='https://pledgie.com/campaigns/30821'><img alt='Click here to lend your support to: Skyrocket: Multi Threading for Ember Applications and make a donation at pledgie.com !' src='https://pledgie.com/campaigns/30821.png?skin_name=chrome' border='0' ></a>

