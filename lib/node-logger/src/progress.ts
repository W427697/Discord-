/* eslint-disable no-console */
interface ProgressEvent {
  progress?: number;
  done?: boolean;
  message: string;
  details?: string[];
}

interface States {
  [type: string]: ProgressEvent;
}
type Subscriber = (event: ProgressEvent) => void;
interface Subscribers {
  [type: string]: Subscriber[];
}

const states: States = {};
const subscribers: Subscribers = {};

export const emit = (type: string, event: ProgressEvent) => {
  states[type] = event;

  if (subscribers[type]) {
    setImmediate(() => {
      subscribers[type].forEach(s => {
        if (s && typeof s === 'function') {
          s(states[type]);
        } else {
          console.log('subscriber was not a function');
          console.dir({ type, s, states });
        }
      });
    });
  }
};

export const subscribe = (type: string, fn: Subscriber) => {
  subscribers[type] = (subscribers[type] || []).concat(fn);

  if (states[type]) {
    setImmediate(() => {
      fn(states[type]);
    });
  }
};

export const unsubscribe = (type: string, fn: Subscriber) => {
  subscribers[type] = subscribers[type] ? subscribers[type].filter(i => i !== fn) : [];
};
