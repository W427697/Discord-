import { config } from './preview/configureActions';

interface ArgsActionsKeyValue {
  [s: string]: any;
}

declare module '@storybook/addon-actions' {
  export interface Options {
    depth: number;
    clearOnStoryChange: boolean;
    limit: number;
  }

  export interface Action {
    func(...args: any[]): any;
  }

  export interface DecoratedAction {
    action: Action;
    actions: (...args: string[] | ArgsActionsKeyValue) => any; // todo return correct object
    withActions: (...args: any[]) => any; // todo return correct object
  }

  export function action(name: string, options: Options = config): Action;
  export function actions(...args: any[] | ArgsActionsKeyValue, options: Options = config): any; // todo return correct object
  export function decorate(decorators: any[] /* todo add correct type */): DecoratedAction; // todo return correct object
  export function decorateAction(decorators): Action; // todo not sure if correct
  export function withActions(...args: any[]): any; // todo supposed to return story
}
