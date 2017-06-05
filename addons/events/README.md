# Storybook Addon Actions
[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://storybooks-slackin.herokuapp.com/badge.svg)](https://storybooks-slackin.herokuapp.com/)

This [Storybook](https://getstorybook.io) Addon Events allows you to add events for your stories. It can be very useful when you create React Native + Native applications and communicate between them using events. This addon helps you to simulate Native events.


This is how Events look like:
![Storybook Addon Events Example](docs/demo1.png)
[Storybook Addon Events Live Demo](https://z4o4z.github.io/storybook-addon-events/index.html)

### Getting Started

```sh
npm i --save-dev @storybook/addon-events
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/storybook/addons';
import '@storybook/addon-events/register';
```

Then write your stories like this:

```js
import React from 'react';
import EventEmiter from 'event-emiter';
import { storiesOf } from '@storybook/storybook';
import WithEvents from '@storybook/addon-events';

import Logger from './Logger';
import * as EVENTS from './events';

const emiter = new EventEmiter();
const emit = emiter.emit.bind(emiter);


storiesOf('WithEvents', module)
  .addDecorator(getStory => (
    <WithEvents
      emit={emit}
      events={[
        {
          name: EVENTS.TEST_EVENT_1,
          title: 'Test event 1',
          payload: 0,
        },
        {
          name: EVENTS.TEST_EVENT_2,
          title: 'Test event 2',
          payload: 'asdasdad asdasdasd',
        },
        {
          name: EVENTS.TEST_EVENT_3,
          title: 'Test event 3',
          payload: {
            string: 'value',
            number: 123,
            array: [1, 2, 3],
            object: {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
          },
        },
        {
          name: EVENTS.TEST_EVENT_4,
          title: 'Test event 4',
          payload: [
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
          ],
        },
      ]}
    >
      {getStory()}
    </WithEvents>
  ))
  .add('Logger', () => <Logger emiter={emiter} />);
```
