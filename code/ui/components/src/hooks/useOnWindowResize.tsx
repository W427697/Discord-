import { useEffect } from 'react';

export function useOnWindowResize(cb: (ev: UIEvent) => void) {
  useEffect(() => {
    window.addEventListener('resize', cb);

    return () => window.removeEventListener('resize', cb);
  }, [cb]);
}
