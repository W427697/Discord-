import { useCallback, useMemo, useRef } from 'react';
import store from 'store2';
import type { PersistedLayoutState } from './Layout.types';

export { store };

export const DEFAULTS: PersistedLayoutState = {
  sidebarWidth: 20,
  panelHeight: 20,
  panelWidth: 20,
  panelPosition: 'bottom',
};

export const get = (): PersistedLayoutState => {
  const data = { ...DEFAULTS };
  try {
    const read = store.local.get(`storybook-layout`);
    if (read) {
      Object.assign(data, read);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return data;
};

const write = (changes: PersistedLayoutState) => {
  try {
    store.local.set(`storybook-layout`, changes);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

export const set = write;

export function usePersistence() {
  const value = useMemo(get, []);
  const setter = useCallback((v: PersistedLayoutState) => {
    ref.current.value = v;
    set(v);
  }, []);
  const ref = useRef({ value, set: setter });

  return ref;
}
