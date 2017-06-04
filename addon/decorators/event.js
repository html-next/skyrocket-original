import { assert } from 'skyrocket/-debug/index';

export default function event(context, resolution, name) {
  let service;
  const prop = name || resolution;

  assert(`Won't overwrite ${prop} on ${context}`, !context[prop]);

  Object.defineProperty(context, prop, {
    enumerable: false,
    configurable: false,
    get() {
      service = service || getOwner(context).lookupSync(`service:${resolution}`);

      return service;
    },
    set() {}
  });
}
