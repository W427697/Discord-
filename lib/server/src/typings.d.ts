import * as React from 'react';

import { Widgets } from 'blessed';

// declare module 'ink-box';
// declare module 'ink-gradient';
// declare module 'ink-big-text';

declare global {
  interface Children {
    children?:
      | string
      | JSX.Children
      | JSX.Children[]
      | ReactNode
      | ReactElement
      | JSX.Element
      | JSX.Element[]
      | JSX.IntrinsicElements;
  }
  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
  type ConvertToReact<S> = Omit<S, 'children'> & Children;

  interface GridRenderProps {
    row?: number;
    rowSpan?: number;
    col?: number;
    colSpan?: number;
  }

  namespace JSX {
    interface IntrinsicElements {
      'blessed-bigtext': ConvertToReact<Widgets.BigTextOptions & GridRenderProps>;
      'blessed-box': ConvertToReact<Widgets.BoxOptions & GridRenderProps>;
      'blessed-button': ConvertToReact<Widgets.ButtonOptions & GridRenderProps>;
      'blessed-checkbox': ConvertToReact<Widgets.CheckboxOptions & GridRenderProps>;
      'blessed-escape': any;
      'blessed-filemanager': ConvertToReact<Widgets.FileManagerOptions & GridRenderProps>;
      'blessed-form': ConvertToReact<Widgets.FormOptions & GridRenderProps>;
      'blessed-input': ConvertToReact<Widgets.InputOptions & GridRenderProps>;
      'blessed-layout': ConvertToReact<Widgets.LayoutOptions & GridRenderProps>;
      'blessed-line': ConvertToReact<Widgets.LineOptions & GridRenderProps>;
      'blessed-list': ConvertToReact<
        Widgets.ListOptions<Widgets.ListElementStyle> & GridRenderProps
      >;
      'blessed-listbar': ConvertToReact<Widgets.ListbarOptions & GridRenderProps>;
      'blessed-listtable': ConvertToReact<Widgets.ListTableOptions & GridRenderProps>;
      'blessed-loading': ConvertToReact<Widgets.LoadingOptions & GridRenderProps>;
      'blessed-log': ConvertToReact<Widgets.LogOptions & GridRenderProps>;
      'blessed-message': ConvertToReact<Widgets.MessageOptions & GridRenderProps>;
      'blessed-program': ConvertToReact<Widgets.IScreenOptions & GridRenderProps>;
      'blessed-progressbar': ConvertToReact<Widgets.ProgressBarOptions & GridRenderProps>;
      'blessed-prompt': ConvertToReact<Widgets.PromptOptions & GridRenderProps>;
      'blessed-question': ConvertToReact<Widgets.QuestionOptions & GridRenderProps>;
      'blessed-radiobutton': ConvertToReact<Widgets.RadioButtonOptions & GridRenderProps>;
      'blessed-radioset': ConvertToReact<Widgets.RadioSetOptions & GridRenderProps>;
      'blessed-scrollablebox': ConvertToReact<Widgets.BoxOptions & GridRenderProps>;
      'blessed-scrollabletext': ConvertToReact<Widgets.BoxOptions & GridRenderProps>;
      'blessed-table': ConvertToReact<Widgets.TableOptions & GridRenderProps>;
      'blessed-terminal': ConvertToReact<Widgets.TerminalOptions & GridRenderProps>;
      'blessed-text': ConvertToReact<Widgets.TextOptions & GridRenderProps>;
      'blessed-textarea': ConvertToReact<Widgets.TextareaOptions & GridRenderProps>;
      'blessed-textbox': ConvertToReact<Widgets.TextboxOptions & GridRenderProps>;
    }
  }
}
