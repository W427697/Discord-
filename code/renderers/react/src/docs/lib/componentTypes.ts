export const isMemo = (component: any) => component.$$typeof === Symbol.for('react.memo');
export const isForwardRef = (component: any) =>
  component.$$typeof === Symbol.for('react.forward_ref');
export const isSuspense = (component: any) => component.$$typeof === Symbol.for('react.suspense');
export const isProfiler = (component: any) => component.$$typeof === Symbol.for('react.profiler');
