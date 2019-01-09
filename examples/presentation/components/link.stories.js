import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';

import Link from './link';

const Holder = styled.div({
  margin: 10,
  border: '1px dashed deepskyblue',
});

storiesOf('Core|Link', module).add('types', () => (
  <Fragment>
    <Holder>
      <Link href="https://example.com">This is a external link</Link>
    </Holder>
    <Holder>
      <Link href="./">This is a internal link</Link>
    </Holder>
  </Fragment>
));
