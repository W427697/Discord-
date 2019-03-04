/* eslint-disable import/no-dynamic-require */
const event = process.env.GITHUB_EVENT_NAME;
const payloadPath = process.env.GITHUB_EVENT_PATH;
const payload = require(payloadPath);

// eslint-disable-next-line no-console
console.log(event, payload);
