declare module 'webpackbar' {
  import { Plugin } from 'webpack';

  class WebpackBar extends Plugin {
    constructor(options?: Options);

    state: State;
  }

  WebpackBar.Reporter = Reporter;

  interface Stats {
    count: number;
    time: [number, number];
  }

  class Profile {
    requests: any[];

    name: string;

    constructor(name: string);

    getStats(): { ext: Stats; loader: Stats };
  }

  export interface State {
    start: [number, number] | null;
    progress: number;
    done: boolean;
    message: string;
    details: string[];
    request: {
      file: string;
      loaders: string[];
    } | null;
    hasErrors: boolean;
    color: string;
    name: string;
  }

  type Handler = (context: WebpackBar) => void;

  export interface Reporter {
    start?: Handler;
    change?: Handler;
    update?: Handler;
    done?: Handler;
    progress?: Handler;
    allDone?: Handler;
    beforeAllDone?: Handler;
    afterAllDone?: Handler;
  }

  interface SharedState {
    [name: string]: State;
  }

  interface Options {
    /** Display name */
    name?: string;
    /** Color output of the progress bar */
    color?: string;
    /** Enable the profiler for files and loaders */
    profile?: boolean;
    /** Enable bars reporter */
    fancy?: boolean;
    /** Enable a simple log reporter (only start and end) */
    basic?: boolean;
    /** Register a custom reporter */
    reporter?: Reporter;
    /** Register a custom reporter */
    reporters?: Array<Reporter | string>;
  }

  export default WebpackBar;
}

declare module 'ink-box';
declare module 'ink-gradient';
declare module 'ink-big-text';

// declare module 'neo-blessed' {
//   export * from 'blessed';
// }

// declare namespace JSX {
//   import { Widgets } from 'blessed';

//     interface Children {
//       children?: string | JSX.Children | JSX.Children[] | JSX.Element | JSX.Element[] | JSX.IntrinsicElements;
//     }

//     type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

//     type ConvertToReact<S> = Omit<S, 'children'> & Children;

//   interface IntrinsicElements {
//     'blessed-bigtext': ConvertToReact<Widgets.BigTextOptions>
//     'blessed-box': ConvertToReact<Widgets.BoxOptions>;
//     'blessed-button': ConvertToReact<Widgets.ButtonOptions>
//     'blessed-checkbox': ConvertToReact<Widgets.CheckboxOptions>
//     'blessed-escape': any
//     'blessed-filemanager': ConvertToReact<Widgets.FileManagerOptions>
//     'blessed-form': ConvertToReact<Widgets.FormOptions>
//     'blessed-input': ConvertToReact<Widgets.InputOptions>
//     'blessed-layout': ConvertToReact<Widgets.LayoutOptions>
//     'blessed-line': ConvertToReact<Widgets.LineOptions>
//     'blessed-list': ConvertToReact<Widgets.ListOptions<Widgets.ListElementStyle>>
//     'blessed-listbar': ConvertToReact<Widgets.ListbarOptions>
//     'blessed-listtable': ConvertToReact<Widgets.ListTableOptions>
//     'blessed-loading': ConvertToReact<Widgets.LoadingOptions>
//     'blessed-log': ConvertToReact<Widgets.LogOptions>
//     'blessed-message': ConvertToReact<Widgets.MessageOptions>
//     'blessed-program': ConvertToReact<Widgets.IScreenOptions>
//     'blessed-progressbar': ConvertToReact<Widgets.ProgressBarOptions>
//     'blessed-prompt': ConvertToReact<Widgets.PromptOptions>
//     'blessed-question': ConvertToReact<Widgets.QuestionOptions>
//     'blessed-radiobutton': ConvertToReact<Widgets.RadioButtonOptions>
//     'blessed-radioset': ConvertToReact<Widgets.RadioSetOptions>
//     'blessed-scrollablebox': ConvertToReact<Widgets.BoxOptions>
//     'blessed-scrollabletext': ConvertToReact<Widgets.BoxOptions>
//     'blessed-table': ConvertToReact<Widgets.TableOptions>
//     'blessed-terminal': ConvertToReact<Widgets.TerminalOptions>
//     'blessed-text': ConvertToReact<Widgets.TextOptions>
//     'blessed-textarea': ConvertToReact<Widgets.TextareaOptions>
//     'blessed-textbox': ConvertToReact<Widgets.TextboxOptions>
//   }
// }
