import React, { FunctionComponent, ReactNode, useState, useEffect, useRef } from 'react';
import { styled } from '@storybook/theming';
import { document } from 'global';

import TooltipTrigger from 'react-popper-tooltip';
import { Modifier, Placement } from '@popperjs/core';
import { Tooltip } from './Tooltip';

// A target that doesn't speak popper
const TargetContainer = styled.div<{ mode: string }>`
  display: inline-block;
  cursor: ${(props) => (props.mode === 'hover' ? 'default' : 'pointer')};
`;

const TargetSvgContainer = styled.g<{ mode: string }>`
  cursor: ${(props) => (props.mode === 'hover' ? 'default' : 'pointer')};
`;

interface WithHideFn {
  onHide: () => void;
}

export interface WithTooltipPureProps {
  svg?: boolean;
  trigger?: 'none' | 'hover' | 'click' | 'right-click';
  closeOnClick?: boolean;
  placement?: Placement;
  modifiers?: Array<Partial<Modifier<string, {}>>>;
  hasChrome?: boolean;
  tooltip: ReactNode | ((p: WithHideFn) => ReactNode);
  children: ReactNode;
  tooltipShown?: boolean;
  onVisibilityChange?: (visibility: boolean) => void;
  onDoubleClick?: () => void;
}

// Pure, does not bind to the body
const WithTooltipPure: FunctionComponent<WithTooltipPureProps> = ({
  svg,
  trigger,
  closeOnClick,
  placement,
  modifiers,
  hasChrome,
  tooltip,
  children,
  tooltipShown,
  onVisibilityChange,
  ...props
}) => {
  const internalTriggerRef = useRef(null);
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      onVisibilityChange(false);
    }
  };

  const prevOpen = React.useRef(tooltipShown);
  React.useEffect(() => {
    if (prevOpen.current === true && tooltipShown === false) {
      // eslint-disable-next-line no-unused-expressions
      internalTriggerRef.current?.focus();
    }
    prevOpen.current = tooltipShown;
  }, [tooltipShown]);

  const Container = svg ? TargetSvgContainer : TargetContainer;

  return (
    <TooltipTrigger
      placement={placement}
      trigger={trigger}
      modifiers={modifiers}
      tooltipShown={tooltipShown}
      onVisibilityChange={onVisibilityChange}
      tooltip={({
        getTooltipProps,
        getArrowProps,
        tooltipRef,
        arrowRef,
        placement: tooltipPlacement,
      }) => (
        <Tooltip
          hasChrome={hasChrome}
          placement={tooltipPlacement}
          tooltipRef={tooltipRef}
          arrowRef={arrowRef}
          arrowProps={getArrowProps()}
          onKeyDown={handleKeyDown}
          {...getTooltipProps()}
        >
          {typeof tooltip === 'function'
            ? tooltip({ onHide: () => onVisibilityChange(false) })
            : tooltip}
        </Tooltip>
      )}
      getTriggerRef={(element) => {
        internalTriggerRef.current = internalTriggerRef.current || element;
      }}
    >
      {({ getTriggerProps, triggerRef }) => (
        // @ts-ignore
        <Container ref={triggerRef} tabIndex={0} {...getTriggerProps()} {...props}>
          {children}
        </Container>
      )}
    </TooltipTrigger>
  );
};

WithTooltipPure.defaultProps = {
  svg: false,
  trigger: 'hover',
  closeOnClick: false,
  placement: 'top',
  modifiers: [
    {
      name: 'preventOverflow',
      options: {
        padding: 8,
      },
    },
    {
      name: 'offset',
      options: {
        offset: [8, 8],
      },
    },
    {
      name: 'arrow',
      options: {
        padding: 8,
      },
    },
  ],
  hasChrome: true,
  tooltipShown: false,
};

const WithToolTipState: FunctionComponent<
  WithTooltipPureProps & {
    startOpen?: boolean;
  }
> = ({ startOpen, ...rest }) => {
  const [tooltipShown, onVisibilityChange] = useState(startOpen || false);

  useEffect(() => {
    const hide = () => onVisibilityChange(false);
    // Find all iframes on the screen and bind to clicks inside them (waiting until the iframe is ready)
    const iframes: HTMLIFrameElement[] = Array.from(document.getElementsByTagName('iframe'));
    const unbinders: (() => void)[] = [];
    iframes.forEach((iframe) => {
      const bind = () => {
        try {
          if (iframe.contentWindow.document) {
            iframe.contentWindow.document.addEventListener('click', hide);
            unbinders.push(() => {
              try {
                iframe.contentWindow.document.removeEventListener('click', hide);
              } catch (e) {
                // logger.debug('Removing a click listener from iframe failed: ', e);
              }
            });
          }
        } catch (e) {
          // logger.debug('Adding a click listener to iframe failed: ', e);
        }
      };

      bind(); // I don't know how to find out if it's already loaded so I potentially will bind twice
      iframe.addEventListener('load', bind);
      unbinders.push(() => {
        iframe.removeEventListener('load', bind);
      });
    });

    return () => {
      unbinders.forEach((unbind) => {
        unbind();
      });
    };
  });

  return (
    <WithTooltipPure
      {...rest}
      tooltipShown={tooltipShown}
      onVisibilityChange={onVisibilityChange}
    />
  );
};

export { WithTooltipPure, WithToolTipState, WithToolTipState as WithTooltip };
