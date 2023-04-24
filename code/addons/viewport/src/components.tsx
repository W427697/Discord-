import React, { useEffect } from 'react';
import { styled } from '@storybook/theming';
import { IconButton, Form } from '@storybook/components';

export const ActiveViewportSize = styled.div(() => ({
  display: 'inline-flex',
}));

export const ActiveViewportNumericInput = styled(Form.NumericInput)(() => ({
  flexGrow: 0,
  alignSelf: 'center',
  padding: 0,
  paddingLeft: 26,
  height: 26,
}));

export const ActiveViewportIconButton = styled(IconButton)(() => ({
  marginRight: 4,
  marginLeft: 4,
}));

export const DimensionResize = styled.div(({ theme }) => ({
  position: 'absolute',
  userSelect: 'none',
  zIndex: 2,
  left: 8,
  color: theme.color.mediumdark,
  // on hover, change cursor
  ':hover': {
    cursor: 'ew-resize',
  },
  opacity: 0,
}));

export const DimensionLabel = styled.div(({ theme }) => ({
  position: 'absolute',
  zIndex: 1,
  left: 8,
}));

export const ActiveViewportLabelWrapper = styled.div(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  position: 'relative',
  fontSize: theme.typography.size.s2 - 1,
}));

export const ActiveViewportLabel = React.memo(
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
    const previousPosition = React.useRef<number>(null);

    useEffect(() => {
      setDimension(value);
    }, [value]);

    return (
      <ActiveViewportLabelWrapper>
        <DimensionResize
          draggable
          onDragStart={(evt: React.DragEvent<HTMLDivElement>) => {
            previousPosition.current = evt.clientX;
          }}
          onDrag={(evt: React.DragEvent<HTMLDivElement>) => {
            if (evt.clientX > 0) {
              const diff = evt.clientX - previousPosition.current;
              if (diff !== 0) {
                previousPosition.current = evt.clientX;
                onResize(Math.max(dimension + Math.floor(diff / 2), 50));
              }
            }
          }}
        >
          {isHorizontal ? 'W' : 'H'}
        </DimensionResize>
        {/* DimensionResize has an invisible element so  be dragged, so we just render DimensionLabel underneath  */}
        <DimensionLabel>{isHorizontal ? 'W' : 'H'}</DimensionLabel>
        <ActiveViewportNumericInput
          title={title}
          value={dimension}
          hideArrows
          onChange={(v: number) => setDimension(v)}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            e.target.select();
          }}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              onResize(dimension);
            }
          }}
          onBlur={() => {
            onResize(dimension);
          }}
          {...props}
        />
      </ActiveViewportLabelWrapper>
    );
  }
);
ActiveViewportLabel.displayName = 'ActiveViewportLabel';

export const IconButtonWithLabel = styled(IconButton)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

export const IconButtonLabel = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  marginLeft: 10,
}));
