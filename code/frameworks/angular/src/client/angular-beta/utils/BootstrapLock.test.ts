import { Subject } from 'rxjs';

import { queueBootstrapping } from './BootstrapLock';

const tick = (count = 0) => new Promise((resolve) => setTimeout(resolve, count));

describe('BootstrapLock', () => {
  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should lock until complete', async () => {
    const pendingSubject = new Subject<void>();
    const bootstrapApp = jest.fn().mockImplementation(async () => {
      return pendingSubject.toPromise();
    });
    const bootstrapAppFinished = jest.fn();

    queueBootstrapping(bootstrapApp).then(() => {
      bootstrapAppFinished();
    });

    expect(bootstrapApp).toHaveBeenCalled();
    expect(bootstrapAppFinished).not.toHaveBeenCalled();

    pendingSubject.next();
    pendingSubject.complete();

    await tick();

    expect(bootstrapAppFinished).toHaveBeenCalled();
  });

  it('should prevent following tasks, until the preview tasks are complete', async () => {
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

    const pendingSubject3 = new Subject<void>();
    const bootstrapApp3 = jest.fn().mockImplementation(async () => {
      return pendingSubject3.toPromise();
    });
    const bootstrapAppFinished3 = jest.fn();

    queueBootstrapping(bootstrapApp).then(bootstrapAppFinished);
    queueBootstrapping(bootstrapApp2).then(bootstrapAppFinished2);
    queueBootstrapping(bootstrapApp3).then(bootstrapAppFinished3);

    await tick();

    expect(bootstrapApp).toHaveBeenCalled();
    expect(bootstrapAppFinished).not.toHaveBeenCalled();
    expect(bootstrapApp2).not.toHaveBeenCalled();
    expect(bootstrapAppFinished2).not.toHaveBeenCalled();
    expect(bootstrapApp3).not.toHaveBeenCalled();
    expect(bootstrapAppFinished3).not.toHaveBeenCalled();

    pendingSubject.next();
    pendingSubject.complete();

    await tick();

    expect(bootstrapApp).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished).toHaveBeenCalled();
    expect(bootstrapApp2).toHaveBeenCalled();
    expect(bootstrapAppFinished2).not.toHaveBeenCalled();
    expect(bootstrapApp3).not.toHaveBeenCalled();
    expect(bootstrapAppFinished3).not.toHaveBeenCalled();

    pendingSubject2.next();
    pendingSubject2.complete();

    await tick();

    expect(bootstrapApp).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished).toHaveBeenCalled();
    expect(bootstrapApp2).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished2).toHaveBeenCalled();
    expect(bootstrapApp3).toHaveBeenCalled();
    expect(bootstrapAppFinished3).not.toHaveBeenCalled();

    pendingSubject3.next();
    pendingSubject3.complete();

    await tick();

    expect(bootstrapApp).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished).toHaveBeenCalled();
    expect(bootstrapApp2).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished2).toHaveBeenCalled();
    expect(bootstrapApp3).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished3).toHaveBeenCalled();
  });

  it('should reset lock on error', async () => {
    const pendingSubject = new Subject<void>();
    const bootstrapApp = jest.fn().mockImplementation(async () => {
      return pendingSubject.toPromise();
    });
    const bootstrapAppFinished = jest.fn();
    const bootstrapAppError = jest.fn();

    queueBootstrapping(bootstrapApp).then(bootstrapAppFinished).catch(bootstrapAppError);

    expect(bootstrapApp).toHaveBeenCalled();
    expect(bootstrapAppFinished).not.toHaveBeenCalled();

    // eslint-disable-next-line local-rules/no-uncategorized-errors
    pendingSubject.error(new Error('test error'));

    await tick();

    expect(bootstrapApp).toHaveReturnedTimes(1);
    expect(bootstrapAppFinished).not.toHaveBeenCalled();
    expect(bootstrapAppError).toHaveBeenCalled();
  });
});
