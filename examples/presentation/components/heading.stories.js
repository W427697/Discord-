import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';

import Heading from './heading';

const Holder = styled.div({
  margin: 10,
  border: '1px dashed deepskyblue',
});

const Separator = styled.hr({
  border: '0 none',
  borderBottom: '1px dashed silver',
});

storiesOf('Core|Heading', module)
  .add('types', () => (
    <Fragment>
      <Holder>
        <Heading type="mega">The mega presentation title</Heading>
      </Holder>
      <Holder>
        <Heading type="mega" sub="has a subtitle">
          This presentation title
        </Heading>
      </Holder>
      <Separator />
      <Holder>
        <Heading type="main">The main presentation title</Heading>
      </Holder>
      <Holder>
        <Heading type="main" sub="has a subtitle">
          This presentation title
        </Heading>
      </Holder>
      <Separator />
      <Holder>
        <Heading type="sub">A sub type</Heading>
      </Holder>
      <Holder>
        <Heading type="sub" sub="with a subtitle">
          A section type
        </Heading>
      </Holder>
      <Separator />
      <Holder>
        <Heading type="section">A section type</Heading>
      </Holder>
      <Holder>
        <Heading type="section" sub="with a subtitle">
          A section type
        </Heading>
      </Holder>
    </Fragment>
  ))
  .add('mods', () => (
    <div style={{ width: 400 }}>
      <Holder>
        <Heading type="main" mods={['uppercase']}>
          uppercased
        </Heading>
      </Holder>
      <Holder>
        <Heading type="main" mods={['underline']}>
          underlined
        </Heading>
      </Holder>
      <Holder>
        <Heading type="main" mods={['centered']}>
          centered
        </Heading>
      </Holder>
    </div>
  ));
