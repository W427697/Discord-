import { ApplicationRef } from '@angular/core';

const queue: Array<() => Promise<void>> = [];
let isProcessing = false;

export const queueBootstrapping = (fn: () => Promise<ApplicationRef>): Promise<ApplicationRef> => {
  return new Promise<ApplicationRef>((resolve, reject) => {
    queue.push(() => fn().then(resolve).catch(reject));

    if (!isProcessing) {
      processQueue();
    }
  });
};

const processQueue = async () => {
  isProcessing = true;

  while (queue.length > 0) {
    const bootstrappingFn = queue.shift();
    if (bootstrappingFn) {
      // eslint-disable-next-line no-await-in-loop
      await bootstrappingFn();
    }
  }

  isProcessing = false;
};
