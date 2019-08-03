import { story } from '@storybook/react';

/* CASE: wrapped with Object.assign */
export const a = Object.assign(() => null, {
  title: 'A',
});

/* CASE: wrapped with story */
export const b = story(() => null, {
  title: 'B',
});

/* CASE: wrapped with story + referencing object */
const meta = {
  title: 'B',
};

export const c = story(() => null, meta);
