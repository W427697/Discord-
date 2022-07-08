# Storybook Instrumenter

The Storybook Instrumenter is used to patch a (3rd party) module to track and intercept function invocations for step-through debugging using the Interactions addon. In essense, the Instrumenter traverses a given object, recursively monkey-patching any functions to make them "tracked".

During normal operation, tracked functions simply call through to their original function, forwarding the return value. As a side-effect, they also emit a `call` event whenever they are invoked.

Through `options`, functions can be marked "interceptable", which give them another mode of operation. In this "intercept" mode, the original function is _not_ invoked, instead the interceptable function returns a `Promise` which only resolves when receiving an event to do so. This enables step-through debugging, directly in the browser. A consequence of this design is that all interceptable functions must be `await`-ed, even if their original function is not asynchronous (i.e. it normally does not return a Promise).

## API

The primary way to use the Storybook Instrumenter is through the `instrument` function:

```ts
instrument<TObj extends Record<string, any>>(obj: TObj, options: Options): TObj
```

`instrument` takes a plain JS object or imported ES module, and optionally an `options` object. It traverses the input object, recursively iterating over object properties and arrays. Any values with typeof `function` are tracked (through monkey-patching). Finally, a shallow copy of the original object is returned (with functions replaced). If the `mutate: true` option is set, the original object is mutated instead of returning a shallow copy.

## Events

The Storybook Instrumenter uses the [Storybook Channel API](../channels/README.md) to send and receive events.

### Emitted tracking events

The instrumenter emits two types of events for tracking function invocations ("calls"):

- `storybook/instrumenter/call`: Emitted whenever a tracked function is invoked
- `storybook/instrumenter/sync`: Emitted after one or more tracked functions are invoked (batch-wise)

The `storybook/instrumenter/call` event payload contains all metadata about the function invocation, including a unique `id`, any arguments, the method name and object path. However, the order of events is not guaranteed and you may receive the same call multiple times while debugging. Moreover, this event is emitted for _all_ tracked calls, not just interceptable ones.

The `storybook/instrumenter/sync` event payload contains a list of `logItems` which represents a "normalized" log of _interceptable_ calls. The order of calls is guaranteed and step-through debugging will not append to the log but rather update it to set the proper `status` for each call. The log does not contain full call metadata but only a `callId`, so this must be mapped onto received `storybook/instrumenter/call` events. The `storybook/instrumenter/sync` event also contains `callStates`, see below.

### Received control events

The instrumenter listens for these control events:

- `storybook/instrumenter/start`: Remount the story and start the debugger at the first interceptable call
- `storybook/instrumenter/back`: Remount the story and start the debugger at the previous interceptable call
- `storybook/instrumenter/goto`: Fast-forwards to - or remounts and starts debugging at - the given interceptable call
- `storybook/instrumenter/next`: Resolves the Promise for the currently intercepted call, letting execution continue to the next call
- `storybook/instrumenter/end`: Resolves all Promises for intercepted calls, letting execution continue to the end

Remounting is achieved through emitting Storybook's `forceRemount` event. In some situations, this will trigger a full page refresh (of the preview) in order to flush pending promises (e.g. long-running interactions).

### Control states

Besides patching functions, the instrumenter keeps track of "control states". These indicate whether the debugger is available, and which control events are available for use:

- `debugger: boolean`: Whether the `interactionsDebugger` feature flag is enabled
- `start: boolean`: Whether emitting `storybook/instrumenter/start` would work
- `back: boolean`: Whether emitting `storybook/instrumenter/back` would work
- `goto: boolean`: Whether emitting `storybook/instrumenter/goto` would work
- `next: boolean`: Whether emitting `storybook/instrumenter/next` would work
- `end: boolean`: Whether emitting `storybook/instrumenter/end` would work

These values are provided in the `controlStates` object on the `storybook/instrumenter/sync` event payload.
