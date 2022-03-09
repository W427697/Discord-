import originalFetch from 'isomorphic-unfetch';
import retry from 'fetch-retry';
import { v4 } from 'uuid';

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
  const id = v4();
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
