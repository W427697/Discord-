import React, { useState } from 'react';
import Button from './components/BaseButton';

export default {
  title: 'React|Button',
  component: Button,
  parameters: {
    framework: 'react',
  },
};

export const withCounter = () => {
  const [counter, setCounter] = useState(0);
  const label = `Testing: ${counter}`;
  return <Button onClick={() => setCounter(counter + 1)} label={label} />;
};

withCounter.story = {
  name: 'with counter',
};
