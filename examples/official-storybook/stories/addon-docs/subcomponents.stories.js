import React from 'react';
import { ButtonGroup } from '../../components/ButtonGroup';
import { DocgenButton } from '../../components/DocgenButton';

export default {
  title: 'Addons/Docs/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    subcomponents: { Button: DocgenButton },
  },
};

export const basic = () => (
  <ButtonGroup>
    <DocgenButton label="one" />
    <DocgenButton label="two" />
    <DocgenButton label="three" />
  </ButtonGroup>
);
