// @flow
import React, { Fragment } from 'react';
import Event from '@ied/event';
import { version } from '@ied/event/package.json';
import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const component = {
  name: 'Event',
  description: 'A component that represents an event',
  version,
  requirement: `
<!-- Add Material Icons font to your 'index.html' -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  `,
  usage: `
import Event from '@ied/event'

<Event
  date={new Date().setHours(1)}
  icon="person"
  color="red"
  label="my great event !"
>
  <Event
    date={new Date().setSeconds(-24)}
    icon="group"
    label="child event"
    color="green"
    type="created"
  />
</Event>
`,
  component: (
    <Fragment>
      <Event date={new Date().setHours(1)} icon="person" color="red" label="my great event !">
        <Event
          date={new Date().setSeconds(-24)}
          icon="group"
          label="child event"
          color="green"
          type="created"
        />
      </Event>
    </Fragment>
  ),
  props: [
    { name: 'icon', type: 'string', required: true },
    { name: 'date', type: 'Date | number', required: true },
    { name: 'type', type: 'string', required: false },
    { name: 'label', type: 'string', required: false },
    { name: 'color', type: 'string', required: false },
    { name: 'children', type: 'React.Node', required: false },
  ],
};

export default Elements.add('Event', () => <DocPage {...component} />);
