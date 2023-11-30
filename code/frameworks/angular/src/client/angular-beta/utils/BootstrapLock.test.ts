import { Subject } from 'rxjs';

import { bootstrapLock, getCurrentLock } from './BootstrapLock';

const tick = (count: number) => new Promise((resolve) => setTimeout(resolve, count));

describe('BootstrapLock', () => {
  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should lock until complete', async () => {
    expect(getCurrentLock()).toBeNull();

    const pendingSubject = new Subject<void>();
    const bootstrapApp = jest.fn().mockImplementation(async () => {
      return pendingSubject.toPromise();
    });
    const bootstrapAppFinished = jest.fn();

    bootstrapLock('story-1', bootstrapApp).then(bootstrapAppFinished);

    await tick(30);

    expect(getCurrentLock()).toBe('story-1');
    expect(bootstrapApp).toHaveBeenCalled();
    expect(bootstrapAppFinished).not.toHaveBeenCalled();

    pendingSubject.next();
    pendingSubject.complete();

    await tick(30);

    expect(bootstrapApp).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished).toHaveBeenCalled();
    expect(getCurrentLock()).toBeNull();
  });

  it('should prevent second task, until first task complete', async () => {
    expect(getCurrentLock()).toBeNull();

    const pendingSubject = new Subject<void>();
    const bootstrapApp = jest.fn().mockImplementation(async () => {
      return pendingSubject.toPromise();
    });
    const bootstrapAppFinished = jest.fn();

    const pendingSubject2 = new Subject<void>();
    const bootstrapApp2 = jest.fn().mockImplementation(async () => {
      return pendingSubject2.toPromise();
    });
    const bootstrapAppFinished2 = jest.fn();

    bootstrapLock('story-1', bootstrapApp).then(bootstrapAppFinished);
    bootstrapLock('story-2', bootstrapApp2).then(bootstrapAppFinished2);

    await tick(30);

    expect(getCurrentLock()).toBe('story-1');
    expect(bootstrapApp).toHaveBeenCalled();
    expect(bootstrapAppFinished).not.toHaveBeenCalled();
    expect(bootstrapApp2).not.toHaveBeenCalled();
    expect(bootstrapAppFinished2).not.toHaveBeenCalled();

    pendingSubject.next();
    pendingSubject.complete();

    await tick(30);

    expect(getCurrentLock()).toBe('story-2');
    expect(bootstrapApp).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished).toHaveBeenCalled();
    expect(bootstrapApp2).toHaveBeenCalled();
    expect(bootstrapAppFinished2).not.toHaveBeenCalled();

    pendingSubject2.next();
    pendingSubject2.complete();

    await tick(30);

    expect(getCurrentLock()).toBeNull();
    expect(bootstrapApp).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished).toHaveBeenCalled();
    expect(bootstrapApp2).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished2).toHaveBeenCalled();
  });

  it('should reset lock on error', async () => {
    expect(getCurrentLock()).toBeNull();

    const pendingSubject = new Subject<void>();
    const bootstrapApp = jest.fn().mockImplementation(async () => {
      return pendingSubject.toPromise();
    });
    const bootstrapAppFinished = jest.fn();
    const bootstrapAppError = jest.fn();

    bootstrapLock('story-1', bootstrapApp).then(bootstrapAppFinished).catch(bootstrapAppError);

    await tick(30);

    expect(getCurrentLock()).toBe('story-1');
    expect(bootstrapApp).toHaveBeenCalled();
    expect(bootstrapAppFinished).not.toHaveBeenCalled();

    // eslint-disable-next-line local-rules/no-uncategorized-errors
    pendingSubject.error(new Error('test error'));

    await tick(30);

    expect(getCurrentLock()).toBeNull();
    expect(bootstrapApp).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished).not.toHaveBeenCalled();
    expect(bootstrapAppError).toHaveBeenCalled();
  });
});
