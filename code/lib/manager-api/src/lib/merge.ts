import { mergeWith, isEqual } from 'lodash-es';

import { logger } from '@storybook/client-logger';

export default <TObj = any>(a: TObj, b: Partial<TObj>) =>
  mergeWith({}, a, b, (objValue: TObj, srcValue: Partial<TObj>) => {
    if (Array.isArray(srcValue) && Array.isArray(objValue)) {
      srcValue.forEach((srcItem) => {
        const existing = objValue.find(
          (objItem) => objItem === srcItem || isEqual(objItem, srcItem)
        );
        if (!existing) {
          objValue.push(srcItem);
        }
      });

      return objValue;
    }
    if (Array.isArray(objValue)) {
      logger.log(['the types mismatch, picking', objValue]);
      return objValue;
    }
    return undefined;
  });
