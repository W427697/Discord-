import NextHeader from './NextHeader';
import { cookies, headers } from '@storybook/nextjs/headers';

export default {
  component: NextHeader,
};

export const Default = {
  loaders: async () => {
    cookies().set('fullName', 'Jane Doe');
    headers().set('timezone', 'Central European Summer Time');
  },
};
