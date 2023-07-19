export const EVENTS = {
  CALL: 'storybook/instrumenter/call',
  SYNC: 'storybook/instrumenter/sync',
  START: 'storybook/instrumenter/start',
  BACK: 'storybook/instrumenter/back',
  GOTO: 'storybook/instrumenter/goto',
  NEXT: 'storybook/instrumenter/next',
  END: 'storybook/instrumenter/end',
};

export enum CallStates {
  DONE = 'done',
  ERROR = 'error',
  ACTIVE = 'active',
  WAITING = 'waiting',
}
