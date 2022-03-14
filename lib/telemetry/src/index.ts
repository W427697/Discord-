export * from './storybook-metadata';

type EventType = 'start' | 'build' | 'upgrade' | 'init' | 'error';
interface Payload {
  [key: string]: any;
}

interface Options {
  immediate: boolean; // this option cause the fetch to be fired immediately
}

export const telemetry = async (
  eventType: EventType,
  payload: Payload,
  options?: Partial<Options>
) => {
  console.log('telemetry', { eventType, payload });

  // I want to be able to await, to ensure all fetch request have been sent before continuing
  // this is important when reporting an error because the next call will be process.exit(), which would kill the process
};
