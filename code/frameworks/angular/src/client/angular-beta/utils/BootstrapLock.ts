import { ApplicationRef } from '@angular/core';

let lock: string | null = null;

/**
 * Returns the selector of the component being bootstrapped, or null if no
 * component is being bootstrapped.
 */
export const getCurrentLock = (): string | null => {
  return lock;
};

/**
 * Waits for chance to acquire lock for a component to bootstrap.
 *
 * @param selector the selectory of the component requesting a lock to bootstrap
 * @returns
 */
const acquireLock = (selector: string) => {
  return new Promise<void>((resolve) => {
    function checkLock() {
      if (lock === null) {
        lock = selector;
        resolve();
      } else {
        setTimeout(checkLock, 30);
      }
    }

    checkLock();
  });
};

/**
 * Delays bootstrapping until a lock is acquired, so that only one application
 * can be bootstrapped at a time.
 *
 * Bootstrapping multiple applications at once can cause Angular to throw an
 * error that a component is declared in multiple modules.
 *
 * @param selector the selectory of the component requesting a lock to bootstrap
 * @param fn callback that should complete the bootstrap process
 * @returns ApplicationRef from the completed bootstrap process
 */
export const bootstrapLock = async (selector: string, fn: () => Promise<ApplicationRef>) => {
  await acquireLock(selector);
  try {
    const ref = await fn();
    lock = null;
    return ref;
  } catch (e) {
    lock = null;
    throw e;
  }
};
