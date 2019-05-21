/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-stateless-function */
import { Component } from 'react';

interface Position {
  row: number;
  rowSpan: number;
  col: number;
  colSpan: number;
}

interface AnyProps {
  [propName: string]: any;
}

export class Map extends Component<Position & { label: string }, any> {}

export class Bar extends Component<Position & AnyProps, any> {}
export class Canvas extends Component<Position & AnyProps, any> {}
export class Carousel extends Component<Position & AnyProps, any> {}
export class Donut extends Component<Position & AnyProps, any> {}
export class Gauge extends Component<Position & AnyProps, any> {}
export class GaugeList extends Component<Position & AnyProps, any> {}
export function Grid(props: any): any;
export class GridItem extends Component<Position & AnyProps, any> {}
export class Lcd extends Component<Position & AnyProps, any> {}
export class Line extends Component<Position & AnyProps, any> {}
export class Log extends Component<Position & AnyProps, any> {}
export class Markdown extends Component<Position & AnyProps, any> {}
export class Picture extends Component<Position & AnyProps, any> {}
export class Sparkline extends Component<Position & AnyProps, any> {}
export class StackedBar extends Component<Position & AnyProps, any> {}
export class Table extends Component<Position & AnyProps, any> {}
export class Tree extends Component<Position & AnyProps, any> {}

export function createBlessedComponent(blessedElement: any): any;
