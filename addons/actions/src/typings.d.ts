export interface Options {
  depth: number;
  clearOnStoryChange: boolean;
  limit: number;
}

export interface Action {
  func(...args: any[]): void;
}

export interface DecoratedAction {
  action: Action;
  actions: (...args) => any; // todo return correct object
  withActions: (...args) => any; // todo return correct object
}

declare module '@storybook/addon-actions' {
  export function action(name: string, options: Options): Action;
  export function actions(...args, options: Options): any; // todo return correct object
  export function decorate(decorators: any[] /* todo add correct type */): DecoratedAction; // todo return correct object
}
