import { Story } from '@storybook/store';

import { getSnippet } from '../../blocks/getSnippet';

export const extractSnippet = (story: Story<any>) => {
  return getSnippet('', story);
};
