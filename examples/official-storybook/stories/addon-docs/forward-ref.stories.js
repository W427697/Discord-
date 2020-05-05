import React from 'react';
import { DocgenButton } from '../../components/DocgenButton';

// eslint-disable-next-line react/prop-types
const ForwardedButton = React.forwardRef(({ label = '', ...props }, ref) => (
  <DocgenButton ref={ref} label={label} {...props} />
));

export default {
  title: 'Addons|Docs/ForwardRef',
  component: ForwardedButton,
  parameters: { chromatic: { disable: true } },
};

export const displaysCorrectly = () => <ForwardedButton label="hello" />;
displaysCorrectly.story = { name: 'Displays forwarded ref components correctly' };
