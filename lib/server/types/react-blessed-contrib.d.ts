// /* eslint-disable react/no-multi-comp */
// /* eslint-disable react/prefer-stateless-function */
// import { Component, ReactNode, ReactElement } from 'react';
// import { Widgets } from 'blessed';
// import { Widgets as ContribWidgets } from 'blessed-contrib';

// interface Children {
//   children?:
//     | string
//     | ReactNode
//     | ReactElement
//     | JSX.Children
//     | JSX.Children[]
//     | JSX.Element
//     | JSX.Element[]
//     | JSX.IntrinsicElements;
// }

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// type ConvertToReact<S> = Omit<Omit<S, 'screen'>, 'children'> & Children;

// interface GridItemProps {
//   row: number;
//   rowSpan: number;
//   col: number;
//   colSpan: number;
//   component: Component;
//   options: any;
// }

// interface GridRenderProps {
//   row?: number;
//   rowSpan?: number;
//   col?: number;
//   colSpan?: number;
// }

// interface AnyProps {
//   [propName: string]: any;
// }

// // export class Map extends Component<Position & { label: string }, any> {}

// export class Bar extends Component<
//   ConvertToReact<ContribWidgets.BarOptions & GridRenderProps>,
//   any
// > {}
// export class Map extends Component<
//   ConvertToReact<ContribWidgets.MapOptions & GridRenderProps>,
//   any
// > {}
// export class Grid extends Component<ConvertToReact<ContribWidgets.GridOptions>, any> {}

// export class GridItem extends Component<GridItemProps, any> {}

// export class Canvas extends Component<Position & AnyProps, any> {}
// export class Carousel extends Component<Position & AnyProps, any> {}
// export class Donut extends Component<Position & AnyProps, any> {}
// export class Gauge extends Component<Position & AnyProps, any> {}
// export class GaugeList extends Component<Position & AnyProps, any> {}
// export class Lcd extends Component<Position & AnyProps, any> {}
// export class Line extends Component<Position & AnyProps, any> {}
// export class Log extends Component<Position & AnyProps, any> {}
// export class Markdown extends Component<Position & AnyProps, any> {}
// export class Picture extends Component<Position & AnyProps, any> {}
// export class Sparkline extends Component<Position & AnyProps, any> {}
// export class StackedBar extends Component<Position & AnyProps, any> {}
// export class Table extends Component<Position & AnyProps, any> {}
// export class Tree extends Component<Position & AnyProps, any> {}

// export function createBlessedComponent(blessedElement: any): any;
