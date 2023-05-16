import type { RefObject, ReactElement } from 'react';
import { Component } from 'react';
import { browserSupportsCssZoom } from './browserSupportsCssZoom';

export type IZoomIFrameProps = {
  scale: number;
  children: ReactElement<HTMLIFrameElement>;
  iFrameRef: RefObject<HTMLIFrameElement>;
  active?: boolean;
};

export class ZoomIFrame extends Component<IZoomIFrameProps> {
  iframe?: HTMLIFrameElement;

  componentDidMount() {
    const { iFrameRef } = this.props;
    this.iframe = iFrameRef.current;
  }

  shouldComponentUpdate(nextProps: IZoomIFrameProps) {
    const { scale, active } = this.props;

    if (scale !== nextProps.scale) {
      this.setIframeInnerZoom(nextProps.scale);
    }

    if (active !== nextProps.active) {
      this.iframe?.setAttribute('data-is-storybook', nextProps.active ? 'true' : 'false');
    }

    // this component renders an iframe, which gets updates via post-messages
    // never update this component, it will cause the iframe to refresh
    // the only exception is when the url changes, which happens when the version changes
    // eslint-disable-next-line react/destructuring-assignment
    return nextProps.children.props.src !== this.props.children.props.src;
  }

  setIframeInnerZoom(scale: number) {
    try {
      if (this.iframe?.contentDocument?.body?.style) {
        const { style } = this.iframe.contentDocument.body;
        if (browserSupportsCssZoom()) {
          Object.assign(style, {
            zoom: 1 / scale,
            minHeight: `calc(100vh / ${1 / scale})`,
          });
        } else {
          Object.assign(style, {
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            transform: `scale(${1 / scale})`,
            transformOrigin: 'top left',
          });
        }
      } else {
        this.setIframeZoom(scale);
      }
    } catch (e) {
      this.setIframeZoom(scale);
    }
  }

  setIframeZoom(scale: number) {
    if (this.iframe?.style) {
      const { style } = this.iframe;
      Object.assign(style, {
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        transform: `scale(${1 / scale})`,
        transformOrigin: 'top left',
      });
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}
