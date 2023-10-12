// @ts-expect-error wrong react version
import React, { cache } from 'react';

const requestId = cache(() => Math.random());

export const Mock = {
  cache: {} as Record<string, any>,
  set(data: any) {
    const id = requestId();
    console.log('Mock.set', { id, data });
    this.cache[id] = data;
  },
  get() {
    const id = requestId();
    const data = this.cache[id];
    console.log('Mock.get', { id, data });
    return data;
  },
};
