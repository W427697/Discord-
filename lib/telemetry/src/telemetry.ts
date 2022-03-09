import originalFetch from 'isomorphic-unfetch';
import retry from 'fetch-retry';
import { nanoid } from 'nanoid';

const URL = 'https://storybook.js.org/telemetry';

// const logger = console;
const logger = {
  log: (..._args: any[]) => 0,
  warn: (..._args: any[]) => 0,
};

const fetch = retry(originalFetch);

export async function sendTelemetry(
  name: string,
  data: Record<string, any>,
  options = { delay: 1000 }
) {
  // We use this id so we can de-dupe events that arrive at the index multiple times due to the
  // use of retries. There are situations in which the request "5xx"s (or times-out), but
  // the server actually gets the request and stores it anyway.
  const id = nanoid();
  logger.log('Sending telemetry', { id, name });

  try {
    const { status } = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify({ ...data, id, name }),
      headers: { 'Content-Type': 'application/json' },
      retries: 3,
      retryOn: [503, 504],
      retryDelay: (attempt) => 2 ** attempt * options.delay,
    });

    if (status !== 200) {
      logger.warn(`Failed to send telemetry with status: ${status}`, { id, name });
      return false;
    }
    logger.log('Successfully sent telemetry', { id, name });
    return true;
  } catch (err) {
    logger.warn(`Failed to send telemetry: ${err.message}`, { id, name });
    return false;
  }
}
