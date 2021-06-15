import { styled, Theme } from '@storybook/theming';
import React, { FC, HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { useContentRect } from '../hooks/useContentRect';
import { getHorizontalValues } from './utils/get-horiztontal-values';
import { getVerticalValues } from './utils/get-vertical-values';
import { getStateValues } from './utils/get-state-values';

const defaultSliderPadding = 2;
const defaultSliderSize = 6;
const defaultSliderOpacity = 0.5;
const defaultSliderColor = '#444444';

interface Scroll {
  left: number;
  top: number;
}

interface StateItem {
  sliderSize: number;
  trackSize: number;
  sliderPosition: number;
  show: boolean;
}

interface State {
  vertical: StateItem;
  horizontal: StateItem;
  scroll: Scroll;
}

export type ScrollBarProps = {
  vertical?: boolean;
  verticalPosition?: 'left' | 'right';
  horizontal?: boolean;
  horizontalPosition?: 'top' | 'bottom';
  sliderSize?: number;
  sliderColor?: string;
  sliderPadding?: number;
  sliderOpacity?: number;
  sliderType?: keyof Theme['color'];
  showOn?: 'always' | 'hover' | 'scroll';
} & HTMLAttributes<HTMLDivElement>;

export const ScrollBar: FC<ScrollBarProps> = ({
  vertical: showVertical,
  verticalPosition = 'right',
  horizontal: showHorizontal,
  horizontalPosition = 'bottom',
  sliderSize = defaultSliderSize,
  sliderPadding = defaultSliderPadding,
  sliderOpacity = defaultSliderOpacity,
  sliderColor = defaultSliderColor,
  sliderType,
  showOn = 'hover',
  onScroll,
  children,
  ...rest
}) => {
  const sliderSafePadding = 4;
  const sliderSafeSpacing = sliderSize + sliderPadding + sliderSafePadding * 2;
  const outerRef = useRef<HTMLDivElement>();
  const innerRef = useRef<HTMLDivElement>();
  const { width: outerWidth, height: outerHeight } = useContentRect(outerRef);
  const { width: innerWidth, height: innerHeight } = useContentRect(innerRef);

  const [state, setState] = useState<State>({
    scroll: { left: 0, top: 0 },
    vertical: { sliderSize: 0, trackSize: 0, sliderPosition: 0, show: showVertical },
    horizontal: { sliderSize: 0, trackSize: 0, sliderPosition: 0, show: showHorizontal },
  });

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const { scrollLeft, scrollTop } = event.currentTarget;

      setState({
        ...state,
        scroll: { left: scrollLeft, top: scrollTop },
        horizontal: getHorizontalValues({
          innerWidth,
          outerWidth,
          scrollLeft,
          showHorizontal,
          showVertical: state.vertical.show,
          sliderSafePadding,
          sliderSafeSpacing,
          outerRef,
        }),
        vertical: getVerticalValues({
          innerHeight,
          outerHeight,
          scrollTop,
          showHorizontal: state.horizontal.show,
          showVertical,
          sliderSafePadding,
          sliderSafeSpacing,
          outerRef,
        }),
      });

      if (onScroll) {
        event.persist();
        onScroll(event);
      }
    },
    [state, setState, outerHeight, outerWidth, sliderSafePadding, sliderSafeSpacing]
  );

  // Get initial scroll position once outerRef and innerRef are not null
  useEffect(() => {
    if (outerRef !== null && outerRef.current && innerRef !== null && innerRef.current) {
      const { scrollTop, scrollLeft } = outerRef.current;

      setState({
        ...state,
        scroll: { left: scrollLeft, top: scrollTop },
        horizontal: getHorizontalValues({
          innerWidth,
          outerWidth,
          scrollLeft,
          showHorizontal,
          showVertical: state.vertical.show,
          sliderSafePadding,
          sliderSafeSpacing,
          outerRef,
        }),
        vertical: getVerticalValues({
          innerHeight,
          outerHeight,
          scrollTop,
          showHorizontal: state.horizontal.show,
          showVertical,
          sliderSafePadding,
          sliderSafeSpacing,
          outerRef,
        }),
      });
    }
  }, [outerRef, innerRef]);

  useEffect(() => {
    let verticalStateValue: StateItem = { ...state.vertical };

    if (innerHeight > outerHeight && showVertical) {
      verticalStateValue = getVerticalValues({
        scrollTop: state.scroll.top,
        outerHeight,
        innerHeight,
        showHorizontal: state.horizontal.show,
        showVertical,
        sliderSafePadding,
        sliderSafeSpacing,
        outerRef,
      });
    } else {
      verticalStateValue = {
        ...verticalStateValue,
        show: false,
      };
    }

    setState({
      ...state,
      vertical: verticalStateValue,
    });
  }, [innerHeight, outerHeight]);

  useEffect(() => {
    let horizontalStateValue: StateItem = { ...state.horizontal };

    if (innerWidth > outerWidth && showHorizontal) {
      horizontalStateValue = getHorizontalValues({
        innerWidth,
        outerWidth,
        scrollLeft: state.scroll.left,
        showHorizontal,
        showVertical: state.vertical.show,
        sliderSafePadding,
        sliderSafeSpacing,
        outerRef,
      });
    } else {
      horizontalStateValue = {
        ...horizontalStateValue,
        show: false,
      };
    }

    setState({
      ...state,
      horizontal: horizontalStateValue,
    });
  }, [innerWidth, outerWidth]);

  /*
    let borderHorizontalDelta = 0;
    let borderVerticalDelta = 0;

    if (outerRef.current) {
      try {
        borderHorizontalDelta =
          Number(outerRef.current.style.borderLeftWidth.replace(/[^0-9.]/gi, '')) +
          Number(outerRef.current.style.borderRightWidth.replace(/[^0-9.]/gi, ''));
        borderVerticalDelta =
          Number(outerRef.current.style.borderTopWidth.replace(/[^0-9.]/gi, '')) +
          Number(outerRef.current.style.borderBottomWidth.replace(/[^0-9.]/gi, ''));
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  */

  // Calculate the values to get the tracks into the right position for the scroll container
  const delta = sliderPadding * 2 + sliderSize;

  const horizontalTrackTopPosition = horizontalPosition === 'top' ? 0 : outerHeight - delta;
  let horizontalTrackLeftPosition = sliderSafePadding;
  const verticalTrackLeftPosition = verticalPosition === 'left' ? 0 : outerWidth - delta;
  let verticalTrackTopPosition = sliderSafePadding;

  if (showVertical && verticalPosition === 'left') {
    horizontalTrackLeftPosition = sliderSafeSpacing - sliderSafePadding;
  }

  if (showHorizontal && horizontalPosition === 'top') {
    verticalTrackTopPosition = sliderSafeSpacing - sliderSafePadding;
  }

  return (
    <Wrapper>
      <ScrollController
        data-sb-scrollbar=""
        ref={outerRef}
        sliderOpacity={sliderOpacity}
        tabIndex={0}
        {...rest}
        onScroll={handleScroll}
      >
        <ScrollInner ref={innerRef}>{children}</ScrollInner>
      </ScrollController>
      {state.vertical.show && (
        <VerticalTrack
          data-sb-scrollbar-track=""
          sliderPadding={sliderPadding}
          sliderOpacity={sliderOpacity}
          style={{
            top: verticalTrackTopPosition,
            left: verticalTrackLeftPosition,
            height: state.vertical.trackSize,
          }}
        >
          <VerticalSlider
            data-sb-scrollbar-slider=""
            sliderColor={sliderColor}
            sliderType={sliderType}
            sliderSize={sliderSize}
            style={{
              transform: `translateY(${state.vertical.sliderPosition}px)`,
              height: state.vertical.sliderSize,
              width: sliderSize,
            }}
          />
        </VerticalTrack>
      )}
      {state.horizontal.show && (
        <HorizontalTrack
          data-sb-scrollbar-track=""
          sliderOpacity={sliderOpacity}
          sliderPadding={sliderPadding}
          style={{
            top: horizontalTrackTopPosition,
            left: horizontalTrackLeftPosition,
            width: state.horizontal.trackSize,
          }}
        >
          <HorizontalSlider
            data-sb-scrollbar-slider=""
            sliderColor={sliderColor}
            sliderType={sliderType}
            sliderSize={sliderSize}
            style={{
              transform: `translateX(${state.horizontal.sliderPosition}px)`,
              width: state.horizontal.sliderSize,
              height: sliderSize,
            }}
          />
        </HorizontalTrack>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div({
  position: 'relative',
});

interface ScrollControllerProps {
  sliderOpacity: number;
}

const ScrollController = styled.div<ScrollControllerProps>(({ sliderOpacity }) => ({
  overflowX: 'scroll',
  overflowY: 'scroll',
  /* Hide scrollbar for IE, Edge and Firefox */
  msOverflowStyle: 'none' /* IE and Edge */,
  scrollbarWidth: 'none' /* Firefox */,
  /* Hide scrollbar for Chrome, Safari and Opera */
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '&:hover': {
    '&~[data-sb-scrollbar-track]': {
      opacity: sliderOpacity,
    },
  },
}));

const ScrollInner = styled.div({
  display: 'inline-block',
});

interface TrackProps {
  sliderPadding: number;
  sliderOpacity: number;
}

const Track = styled.div<TrackProps>({
  position: 'absolute',
  opacity: 0,
  overflow: 'hidden',
  transition: 'opacity 200ms ease-in-out, transform 200ms ease-in-out',
});

const HorizontalTrack = styled(Track)(({ sliderPadding, sliderOpacity }) => ({
  paddingTop: sliderPadding,
  paddingBottom: sliderPadding,
  '&:hover': {
    opacity: sliderOpacity,
    '&~[data-sb-scrollbar-track]': {
      opacity: sliderOpacity,
    },
  },
}));

const VerticalTrack = styled(Track)(({ sliderPadding, sliderOpacity }) => ({
  paddingLeft: sliderPadding,
  paddingRight: sliderPadding,
  '&:hover': {
    opacity: sliderOpacity,
    // transform: 'scaleX(1.1)',
    '&~[data-sb-scrollbar-track]': {
      opacity: sliderOpacity,
    },
  },
}));

interface SliderProps {
  sliderColor?: string;
  sliderType?: keyof Theme['color'];
  sliderSize: number;
}

const Slider = styled.div<SliderProps>(({ theme, sliderColor, sliderType, sliderSize }) => ({
  backgroundColor: sliderType ? theme.color[sliderType] : sliderColor,
  borderTopLeftRadius: sliderSize / 2,
  borderTopRightRadius: sliderSize / 2,
  borderBottomLeftRadius: sliderSize / 2,
  borderBottomRightRadius: sliderSize / 2,
}));

const VerticalSlider = styled(Slider)({});

const HorizontalSlider = styled(Slider)({});
