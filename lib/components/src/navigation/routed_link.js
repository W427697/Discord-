// @flow
import * as React from 'react';

const LEFT_BUTTON = 0;
// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const isPlainLeftClick = (e: SyntheticMouseEvent<>) =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

type MouseHandler = (SyntheticMouseEvent<>) => mixed;

const wrapOnClick: MouseHandler => MouseHandler = fn => e =>
  isPlainLeftClick(e) ? e.preventDefault() || fn(e) : false;

type Props = {
  onClick: ?MouseHandler,
  href: string,
  children: React.Node,
};

export default class RoutedLink extends React.Component<Props> {
  static defaultProps = {
    onClick: null,
    href: '#',
    children: null,
  };

  constructor(props: Props, ...rest: Array<mixed>) {
    super(props, ...rest);

    const { onClick } = props;
    this.onClick = onClick ? wrapOnClick(onClick) : undefined;
  }

  componentWillUpdate({ onClick }: Props) {
    this.onClick = onClick ? wrapOnClick(onClick) : undefined;
  }

  onClick: ?MouseHandler;

  render() {
    const { onClick } = this;
    const { href, children, ...rest } = this.props;
    const props = { href, ...rest, onClick };
    return (
      <a {...props}>
        {children}
      </a>
    );
  }
}
