import originalFetch from 'isomorphic-unfetch';
import retry from 'fetch-retry';
import { nanoid } from 'nanoid';
import { Options } from './types';

const URL = 'https://storybook.js.org/event-log';

// const logger = console;
const logger = {
  log: (..._args: any[]) => 0,
  warn: (..._args: any[]) => 0,
};

const fetch = retry(originalFetch);

let tasks: Promise<any>[] = [];

// getStorybookMetadata -> packagejson + Main.js
// event specific data: sessionId, ip, etc..
// send telemetry
const sessionId = nanoid();

export async function sendTelemetry(
  data: Record<string, any>,
  options: Partial<Options> = { retryDelay: 1000, immediate: false }
) {
  // We use this id so we can de-dupe events that arrive at the index multiple times due to the
  // use of retries. There are situations in which the request "5xx"s (or times-out), but
  // the server actually gets the request and stores it anyway.
  const id = nanoid();

  try {
    const request = fetch(URL, {
      method: 'POST',
      body: JSON.stringify({ ...data, id, sessionId }),
      headers: { 'Content-Type': 'application/json' },
      retries: 3,
      retryOn: [503, 504],
      retryDelay: (attempt) => 2 ** attempt * options.retryDelay,
    });
    tasks.push(request);

    const { status } = await request;

    if (options.immediate) {
      await Promise.all(tasks);
    }

    tasks = tasks.filter((task) => task !== request);

    if (status !== 200) {
      logger.warn(`Failed to send telemetry with status: ${status}`, { id, name: data.eventType });
      return false;
    }
    logger.log('Successfully sent telemetry', { id, name: data.eventType });
    return true;
  } catch (err) {
    logger.warn(`Failed to send telemetry: ${err.message}`, { id, name: data.eventType });
    return false;
  }
}
