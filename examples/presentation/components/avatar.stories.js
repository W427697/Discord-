import React, { Fragment } from 'react';
import styled from '@emotion/styled';

import Avatar from './avatar';

import imageSrc from '../other/team/norbert-de-langen.jpg';

const Holder = styled.div({
  margin: 10,
  border: '1px dashed deepskyblue',
});

export default {
  title: 'Components|Avatar',
};

export const sizes = () => (
  <Fragment>
    <Holder>
      <Avatar src={imageSrc} size={1} />
    </Holder>
    <Holder>
      <Avatar src={imageSrc} size={5} />
    </Holder>
    <Holder>
      <Avatar src={imageSrc} size={10} />
    </Holder>
    <Holder>
      <Avatar src={imageSrc} size={20} />
    </Holder>
  </Fragment>
);

sizes.story = {
  name: 'sizes',
};
