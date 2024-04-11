// re-exports of the actual module
export * from 'next/headers.actual';

// mock utilities/overrides
export { headers } from './headers';
export { cookies } from './cookies';
