import React, { Fragment } from 'react';
import Popover from '@ied/popover';
import Badge from '@ied/badge';
import Row from '@ied/row';

export const EX1 = {
  example: (
    <Fragment>
      <Popover
        component={<Badge icon="keyboard_arrow_right" />}
        style={{
          position: 'absolute',
          left: 10,
          top: 10,
        }}
      >
        <Row icon="person" label="Mr World" description="Filenumber" hoverable />
      </Popover>
      <Popover
        component={<Badge icon="keyboard_arrow_left" />}
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
        }}
      >
        <Row icon="person" label="Mr World" description="Filenumber" hoverable />
      </Popover>
      <Popover
        component={<Badge icon="keyboard_arrow_right" />}
        style={{
          position: 'absolute',
          left: 10,
          bottom: 10,
        }}
      >
        <Row icon="person" label="Mr World" description="Filenumber" hoverable />
      </Popover>
      <Popover
        component={<Badge icon="keyboard_arrow_left" />}
        style={{
          position: 'absolute',
          right: 10,
          bottom: 10,
        }}
      >
        <Row icon="person" label="Mr World" description="Filenumber" hoverable />
      </Popover>
    </Fragment>
  ),
  code: `import Popover from '@ied/popover'

<Popover
component={/* your target component here ! */}
>
  Add any component here !
</Popover>`,
};

export const EX2 = {
  example: (
    <Fragment>
      <Popover
        component={<Badge icon="keyboard_arrow_right" />}
        position={{ left: '100%', top: '0' }}
        style={{ cursor: 'default' }}
      >
        <Row icon="person" label="Mr World" description="Filenumber" hoverable />
      </Popover>
    </Fragment>
  ),
  code: `import Popover from '@ied/popover'

<Popover
  component={/* your target component here ! */}
  position={{left: "100%", top:'0'}}
>
  Add any component here !
</Popover>`,
};

export default () => (
  <Popover component={<Badge icon="people" />} style={{ cursor: 'default' }}>
    <Row icon="person" label="Mr World" description="Filenumber" hoverable />
  </Popover>
);
