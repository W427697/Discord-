/* eslint-disable no-fallthrough */
import type { ReactNode, FC } from 'react';
import React, { useState, Fragment, useEffect, useRef, memo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import memoize from 'memoizerific';

import { styled, Global, type Theme, withTheme } from '@storybook/theming';

import { Icons, IconButton, WithTooltip, TooltipLinkList, Form } from '@storybook/components';

import { useStorybookApi, useParameter, useAddonState } from '@storybook/manager-api';
import { registerShortcuts } from './shortcuts';
import { PARAM_KEY, ADDON_ID } from './constants';
import { MINIMAL_VIEWPORTS } from './defaults';
import type { ViewportAddonParameter, ViewportMap, ViewportStyles, Styles } from './models';

interface ViewportItem {
  id: string;
  title: string;
  styles: Styles;
  type: 'desktop' | 'mobile' | 'tablet' | 'other';
  default?: boolean;
}

const toList = memoize(50)((items: ViewportMap): ViewportItem[] => [
  ...baseViewports,
  ...Object.entries(items).map(([id, { name, ...rest }]) => ({ ...rest, id, title: name })),
]);

const resetViewport: ViewportItem = {
  id: 'reset',
  title: 'Reset viewport',
  styles: null,
  type: 'other',
};

const responsiveViewport: ViewportItem = {
  id: 'responsive',
  title: 'Responsive',
  styles: (prevStyles) => {
    return prevStyles;
  },
  type: 'other',
};

const baseViewports: ViewportItem[] = [resetViewport, responsiveViewport];

const toLinks = memoize(50)((list: ViewportItem[], active: LinkBase, set, state, close): Link[] => {
  return list
    .map((i) => {
      switch (i.id) {
        case resetViewport.id: {
          if (active.id === i.id) {
            return null;
          }
        }
        default: {
          return {
            ...i,
            onClick: () => {
              set({ ...state, selected: i.id });
              close();
            },
          };
        }
      }
    })
    .filter(Boolean);
});

const wrapperId = 'storybook-preview-wrapper';

interface LinkBase {
  id: string;
  title: string;
  right?: ReactNode;
  type: 'desktop' | 'mobile' | 'tablet' | 'other';
  styles: ViewportStyles | ((s: ViewportStyles) => ViewportStyles) | null;
}

interface Link extends LinkBase {
  onClick: () => void;
}

const flip = ({ width, height, ...styles }: ViewportStyles) => ({
  ...styles,
  height: width,
  width: height,
});

const ActiveViewportSize = styled.div(() => ({
  display: 'inline-flex',
}));

const ActiveViewportNumericInput = styled(Form.NumericInput)(() => ({
  flexGrow: 0,
  alignSelf: 'center',
  padding: 0,
  paddingLeft: 26,
  height: 26,
}));

const ActiveViewportIconButton = styled(IconButton)(() => ({
  marginRight: 4,
  marginLeft: 4,
}));

const DimensionResize = styled.div(({ theme }) => ({
  position: 'absolute',
  zIndex: 1,
  left: 8,
  color: theme.color.mediumdark,
  // on hover, change cursor
  ':hover': {
    cursor: 'ew-resize',
  },
}));

const ActiveViewportLabelWrapper = styled.div(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  position: 'relative',
  fontSize: theme.typography.size.s2 - 1,
}));

const ActiveViewportLabel = React.memo(
  ({
    isHorizontal,
    title,
    value,
    onResize,
    ...props
  }: Omit<React.ComponentProps<typeof ActiveViewportNumericInput>, 'onChange'> & {
    onResize: (value: number) => void;
    isHorizontal?: boolean;
  }) => {
    const [dimension, setDimension] = React.useState<number>(value);

    useEffect(() => {
      setDimension(value);
    }, [value]);

    return (
      <ActiveViewportLabelWrapper>
        <DimensionResize>{isHorizontal ? 'W' : 'H'}</DimensionResize>
        <ActiveViewportNumericInput
          title={title}
          value={dimension}
          hideArrows
          onChange={setDimension}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            e.target.select();
          }}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              onResize(dimension);
            }
          }}
          {...props}
        />
      </ActiveViewportLabelWrapper>
    );
  }
);
ActiveViewportLabel.displayName = 'ActiveViewportLabel';

const IconButtonWithLabel = styled(IconButton)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

const IconButtonLabel = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  marginLeft: 10,
}));

interface ViewportToolState {
  isRotated: boolean;
  selected: string | null;
  width: number;
  height: number;
}

const getSizeFromStyles = (
  styles: ViewportStyles,
  state: ViewportToolState
): { width: number; height: number } => {
  let { width, height } = state;
  if (styles) {
    if (styles.width) {
      const w = parseInt(styles.width.replace('px', ''), 10);
      if (!Number.isNaN(w)) {
        width = w;
      }
    }
    if (styles.height) {
      const h = parseInt(styles.height.replace('px', ''), 10);
      if (!Number.isNaN(h)) {
        height = h;
      }
    }
  }
  return { width, height };
};

const getStyles = (
  prevStyles: ViewportStyles,
  styles: Styles,
  state: ViewportToolState
): ViewportStyles => {
  if (styles === null) {
    return null;
  }
  const newStyles = typeof styles === 'function' ? styles(prevStyles) : styles;
  const result = { ...newStyles };
  if (state.selected === responsiveViewport.id) {
    result.width = state.width > 0 ? `${state.width}px` : '100%';
    result.height = state.height > 0 ? `${state.height}px` : '100%';
  }
  return state.isRotated ? flip(result) : result;
};

const getItem = (list: ViewportItem[], selected: string, defaultViewport: string) => {
  return (
    list.find((i) => i.id === selected) ||
    list.find((i) => i.id === defaultViewport) ||
    list.find((i) => i.default) ||
    resetViewport
  );
};

const getSize = (
  list: ViewportItem[],
  defaultViewport: string,
  state: ViewportToolState,
  prevStyles: ViewportStyles
): { width: number; height: number } => {
  const item = getItem(list, state.selected, defaultViewport);
  const styles = getStyles(prevStyles, item.styles, state);
  if (item.id === responsiveViewport.id) {
    const result = {
      width: state.width,
      height: state.height,
    };
    // @ts-expect-error TODO: fix the typings error here
    return state.isRotated ? flip(result) : result;
  }
  return getSizeFromStyles(styles, state);
};

export const ViewportTool: FC = memo(
  withTheme(({ theme }: { theme: Theme }) => {
    const {
      viewports = MINIMAL_VIEWPORTS,
      defaultOrientation = 'portrait',
      defaultViewport = resetViewport.id,
      disable,
    } = useParameter<ViewportAddonParameter>(PARAM_KEY, {});
    const [state, setStateRaw] = useAddonState<ViewportToolState>(ADDON_ID, {
      selected: defaultViewport,
      isRotated: defaultOrientation === 'landscape',
      width: 320,
      height: 568,
    });
    const setStateDebounced = useDebouncedCallback(setStateRaw, 100);

    // Store width/height locally so we can debounce the main state, but still
    // have responsive inputs.
    const [localWidth, setLocalWidth] = useState(state.width);
    const [localHeight, setLocalHeight] = useState(state.height);

    const list = toList(viewports);
    const ref = useRef<ViewportStyles>();
    const api = useStorybookApi();
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    if (!list.find((i) => i.id === defaultViewport)) {
      // eslint-disable-next-line no-console
      console.warn(
        `Cannot find "defaultViewport" of "${defaultViewport}" in addon-viewport configs, please check the "viewports" setting in the configuration.`
      );
    }

    const setState = (newState: ViewportToolState) => {
      const { width, height } = getSize(list, defaultViewport, newState, ref.current);
      const updatedState = {
        ...newState,
        width,
        height,
      };
      setLocalWidth(width);
      setLocalHeight(height);
      setStateDebounced(updatedState);
    };

    useEffect(() => {
      registerShortcuts(api, setState, Object.keys(viewports));
    }, [viewports]);

    useEffect(() => {
      setState({
        selected:
          defaultViewport || (viewports[state.selected] ? state.selected : resetViewport.id),
        isRotated: defaultOrientation === 'landscape',
        width: state.width,
        height: state.height,
      });
    }, [defaultOrientation, defaultViewport]);

    const { selected, isRotated } = state;
    const item = getItem(list, selected, defaultViewport);

    const styles = getStyles(ref.current, item.styles, state);

    useEffect(() => {
      ref.current = styles;
    }, [item]);

    if (disable || Object.entries(viewports).length === 0) {
      return null;
    }

    const isReset = selected === resetViewport.id;
    const isResponsive = selected === responsiveViewport.id;

    let viewportLabel: string;
    if (!isResponsive) {
      viewportLabel = isRotated ? `${item.title} (L)` : `${item.title} (P)`;
    } else {
      viewportLabel = item.title;
    }

    const updateWidth = React.useCallback(
      (value: number) => setState({ ...state, width: value, selected: responsiveViewport.id }),
      []
    );

    const updateHeight = React.useCallback(
      (value: number) => setState({ ...state, height: value, selected: responsiveViewport.id }),
      []
    );

    return (
      <Fragment>
        <WithTooltip
          placement="top"
          tooltip={({ onHide }) => (
            <TooltipLinkList links={toLinks(list, item, setState, state, onHide)} />
          )}
          closeOnOutsideClick
          onVisibleChange={setIsTooltipVisible}
        >
          <IconButtonWithLabel
            key="viewport"
            title="Change the size of the preview"
            active={isTooltipVisible || !!styles}
            onDoubleClick={() => {
              setState({ ...state, selected: resetViewport.id });
            }}
          >
            <Icons icon="grow" />
            {styles ? <IconButtonLabel>{viewportLabel}</IconButtonLabel> : null}
          </IconButtonWithLabel>
        </WithTooltip>

        {!isReset && styles && (
          <ActiveViewportSize>
            <Global
              styles={{
                [`iframe[data-is-storybook="true"]`]: {
                  margin: `auto`,
                  transition: 'none',
                  position: 'relative',
                  border: `1px solid black`,
                  boxShadow: '0 0 100px 100vw rgba(0,0,0,0.5)',

                  ...styles,
                },
                [`#${wrapperId}`]: {
                  padding: theme.layoutMargin,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyItems: 'center',
                  overflow: 'auto',

                  display: 'grid',
                  gridTemplateColumns: '100%',
                  gridTemplateRows: '100%',
                },
              }}
            />
            <ActiveViewportLabel
              title="Viewport width"
              value={localWidth}
              isHorizontal
              onResize={updateWidth}
              size="content"
            />
            <ActiveViewportIconButton
              key="viewport-rotate"
              title="Rotate viewport"
              onClick={() => {
                setState({ ...state, isRotated: !isRotated });
              }}
            >
              <Icons icon="transfer" />
            </ActiveViewportIconButton>
            <ActiveViewportLabel
              title="Viewport height"
              value={localHeight}
              onResize={updateHeight}
              size="content"
            />
          </ActiveViewportSize>
        )}
      </Fragment>
    );
  })
);
