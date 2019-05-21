import merger from 'lodash/merge';
import mergeWith from 'lodash/mergewith';
import isEqual from 'lodash/isequal';

import { logger } from '@storybook/node-logger';

type Merger = typeof merger;
export const merge: Merger = <A>(a: A, ...rest: A[]) =>
  mergeWith({}, a, ...rest, (objValue: any, srcValue: any) => {
    if (Array.isArray(srcValue) && Array.isArray(objValue)) {
      srcValue.forEach(s => {
        const existing = objValue.find(o => o === s || isEqual(o, s));
        if (!existing) {
          objValue.push(s);
        }
      });

      return objValue;
    }
    if (Array.isArray(objValue)) {
      logger.debug('the types mismatch');
      return objValue;
    }
    return undefined;
  });
