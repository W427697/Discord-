import { useEffect } from 'react';

export const useDeprecate = (message: string, predicate = true) => {
  useEffect(() => {
    if (predicate) {
      // eslint-disable-next-line no-console
      console.warn(message);
    }
  }, [message, predicate]);
};
