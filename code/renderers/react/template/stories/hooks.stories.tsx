import React, { FC, useState } from 'react';
import { expect } from '@storybook/jest';

const ButtonWithState: FC = () => {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      {`count: ${count}`}
    </button>
  );
};

export default {
  component: ButtonWithState,
};

export const Basic = {};

export const Fail = {
  play: async () => {
    await expect(false).toBe(true);
  },
};
