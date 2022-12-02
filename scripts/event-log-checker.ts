/* eslint-disable no-console */
import assert from 'assert';
import fetch from 'node-fetch';
import { allTemplates, type TemplateKey } from '../code/lib/cli/src/repro-templates';
import { shouldSkipTask } from './nx-affected-templates';

const PORT = process.env.PORT || 6007;

const eventTypeExpectations = {
  build: {},
};

async function run() {
  const [eventType, templateKey] = process.argv.slice(2) as [string, TemplateKey];

  if (await shouldSkipTask(templateKey)) {
    console.log(`Skipping checks for "${templateKey}" as it was not affected by the changes`);
    return;
  }

  if (!eventType || !templateKey) {
    throw new Error(
      `Need eventType and templateName; call with ./event-log-checker <eventType> <templateName>`
    );
  }

  const expectation = eventTypeExpectations[eventType as keyof typeof eventTypeExpectations];
  if (!expectation) throw new Error(`Unexpected eventType '${eventType}'`);

  const template = allTemplates[templateKey as keyof typeof allTemplates];
  if (!template) throw new Error(`Unexpected template '${templateKey}'`);

  const events = await (await fetch(`http://localhost:${PORT}/event-log`)).json();

  assert.equal(events.length, 2);

  const [bootEvent, mainEvent] = events;

  assert.equal(bootEvent.eventType, 'boot');
  assert.equal(bootEvent.payload?.eventType, eventType);

  assert.equal(mainEvent.eventType, eventType);
  assert.notEqual(mainEvent.eventId, bootEvent.eventId);
  assert.equal(mainEvent.sessionId, bootEvent.sessionId);

  const {
    expected: { renderer, builder, framework },
  } = template;

  assert.equal(mainEvent.metadata.renderer, renderer);
  assert.equal(mainEvent.metadata.builder, builder);
  assert.equal(mainEvent.metadata.framework.name, framework);
}

export {};

if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}
