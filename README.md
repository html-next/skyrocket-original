# Skyrocket

Ambitious applications aren't single threaded.

Skyrocket provides build tooling and a standardized messaging interface
for quickly building and using WebWorkers in your application.

## Installation

```cli
yarn add @html-next/skyrocket
```

## Workers

To create a new worker, add a javascript file defining and exporting a 
single class to the `app/workers` directory. Or run the following command:

```cli
ember g worker <worker-name>
```

## The Worker Interface

Skyrocket provides primitives for communicating between your 
application and your worker. These primitives should be used as
decorators on your worker class.

#### Methods

```js
class Worker {
  @method
  greet() {
    return 'Hello World';
  }
}
```

#### Signals

```js
class Worker {
  @method
  greet() {
    this.say('Hello World');
  }
}
```

#### Properties

```js
class Worker {
  @prop
  get name() {
    return this._name;
  }
  set name(v) {
    this._name = v;
  }
}
```

#### Events

```js
class Worker {
  @event
  click() {
    this.say('Click!');
  }
}
```

```js
class Worker {
  @event({ sends: true, receives: false })
  click() {
    this.say('Click!');
  }
}
```

## The Worker Magic


## Using a Worker in your app.

```js
import injectWorker from 'skyrocket/inject';
...
{
  dataWorker: injectWorker('data-worker'),
  
  doSomething() {
    const dataWorker = this.dataWorker;
    
    // execute the @signal myFunction with some data
    dataWorker.myFunction(<...args>);
    
    // trigger the @event 'click'
    dataWorker.trigger('click', { some: 'data' });

    // listen for the @event 'fetched'
    dataWorker.on('fetched', (event) => {
    
    });

    // see the last known state of @prop foo
    const foo = dataWorker.foo;

    // await the return of some @method doSomething
    return dataWorker.doSomething({ good: 'for you' })
      .then((result) => {})
      .catch((error) => {});
  }
  
}
```
