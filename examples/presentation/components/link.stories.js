import React, { Fragment } from 'react';
import styled from '@emotion/styled';

import Link from './link';

const Holder = styled.div({
  margin: 10,
  border: '1px dashed deepskyblue',
});

export default {
  title: 'Components|Link',
};

export const types = () => (
  <Fragment>
    <p>
      <Link href="https://example.com">This is a external link</Link>
    </p>
    <p>
      <Link href="./">This is a internal link</Link>
    </p>
  </Fragment>
);

types.story = {
  name: 'types',
};
