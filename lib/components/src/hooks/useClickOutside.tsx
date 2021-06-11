import { useEffect, RefObject, useState } from 'react';

interface UseClickOutsideProps<T extends HTMLElement> {
  ref: RefObject<T>;
  blacklist: RefObject<HTMLElement>[];
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useClickOutside<T extends HTMLElement>({
  ref,
  blacklist = [],
}: UseClickOutsideProps<T>) {
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent & { target: Node }) {
      if (ref.current && !ref.current.contains(event.target)) {
        let isBlacklisted = false;

        blacklist.some((blacklistedRef) => {
          const found = blacklistedRef.current.contains(event.target);
          isBlacklisted = found;

          return found;
        });

        if (!isBlacklisted) {
          setClicked(true);

          setTimeout(() => {
            setClicked(false);
          }, 0);
        }
      }
    }

    // Bind the event listener
    // eslint-disable-next-line no-undef
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      // eslint-disable-next-line no-undef
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return clicked;
}
