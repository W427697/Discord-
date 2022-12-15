import { Inter } from '@next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

const Component = () => <h1 className={inter.className}>Google Inter Latin</h1>;

export default {
  component: Component,
};

export const Default = {};
