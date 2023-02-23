import { useEffect } from 'react';

const LoggingComponent = () => {
  useEffect(() => {
    console.log('mounted');
    return () => {
      console.log('unmounted');
    };
  }, []);
};

export default {
  component: LoggingComponent,
  parameters: {
    storyshots: { disable: true },
    chromatic: { disable: true },
  },
};

export const Default = {};
