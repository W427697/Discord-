import React, { FC, HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { styled } from '@storybook/theming';
import { useContentRect } from '../hooks/useContentRect';
import { getStateValues } from './utils/get-state-values';

const scrollTrackPadding = 3;
const scrollSliderSize = 3;

interface Scroll {
  left: number;
  top: number;
}

interface StateItem {
  size: number;
  position: number;
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
  trackPadding?: number;
} & HTMLAttributes<HTMLDivElement>;

export const ScrollBar: FC<ScrollBarProps> = ({
  vertical: showVertical = true,
  verticalPosition = 'right',
  horizontal: showHorizontal = true,
  horizontalPosition = 'bottom',
  sliderSize = scrollSliderSize,
  trackPadding = scrollTrackPadding,
  sliderColor,
  onScroll,
  children,
  ...rest
}) => {
  const outerRef = useRef<HTMLDivElement>();
  const innerRef = useRef<HTMLDivElement>();
  const { width: outerWidth, height: outerHeight, x } = useContentRect(outerRef);
  const { width: innerWidth, height: innerHeight } = useContentRect(innerRef);

  const [state, setState] = useState<State>({
    scroll: { left: 0, top: 0 },
    vertical: { size: 100, position: 0, show: showVertical },
    horizontal: { size: 100, position: 0, show: showHorizontal },
  });

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const { scrollLeft, scrollTop } = event.currentTarget;

      const horizontalStateValue = getStateValues({
        scroll: scrollLeft,
        outerSize: outerWidth,
        innerSize: innerWidth,
        show: showHorizontal,
      });

      const verticalStateValue = getStateValues({
        scroll: scrollTop,
        outerSize: outerHeight,
        innerSize: innerHeight,
        show: showVertical,
      });

      setState({
        ...state,
        scroll: { left: scrollLeft, top: scrollTop },
        horizontal: horizontalStateValue,
        vertical: verticalStateValue,
      });

      if (onScroll) {
        event.persist();
        onScroll(event);
      }
    },
    [state, setState, outerHeight, outerWidth]
  );

  // Get initial scroll position once outerRef and innerRef are not null
  useEffect(() => {
    if (outerRef !== null && outerRef.current && innerRef !== null && innerRef.current) {
      const { scrollTop, scrollLeft } = outerRef.current;
      const horizontalStateValue = getStateValues({
        scroll: scrollLeft,
        outerSize: outerWidth,
        innerSize: innerWidth,
        show: showHorizontal,
      });

      const verticalStateValue = getStateValues({
        scroll: scrollTop,
        outerSize: outerHeight,
        innerSize: innerHeight,
        show: showVertical,
      });

      setState({
        ...state,
        scroll: { left: scrollLeft, top: scrollTop },
        horizontal: horizontalStateValue,
        vertical: verticalStateValue,
      });
    }
  }, [outerRef, innerRef]);

  useEffect(() => {
    let verticalStateValue: StateItem = { ...state.vertical };

    if (innerHeight > outerHeight && showVertical) {
      verticalStateValue = getStateValues({
        scroll: state.scroll.top,
        outerSize: outerHeight,
        innerSize: innerHeight,
        show: showVertical,
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
      horizontalStateValue = getStateValues({
        scroll: state.scroll.left,
        outerSize: outerWidth,
        innerSize: innerWidth,
        show: showHorizontal,
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

  const delta = trackPadding * 2 + sliderSize;
  const horizontalTop = horizontalPosition === 'top' ? 0 : outerHeight - delta;
  const verticalLeft = verticalPosition === 'left' ? 0 : outerWidth - delta;

  return (
    <Wrapper>
      <ScrollController data-sb-scrollbar="" ref={outerRef} {...rest} onScroll={handleScroll}>
        <ScrollInner ref={innerRef}>{children}</ScrollInner>
      </ScrollController>
      {state.vertical.show && (
        <VerticalTrack
          data-sb-scrollbar-track=""
          trackPadding={trackPadding}
          style={{ top: 0, left: verticalLeft, height: outerHeight }}
        >
          <VerticalSlider
            data-sb-scrollbar-slider=""
            style={{
              transform: `translateY(${state.vertical.position}px)`,
              height: state.vertical.size,
            }}
          >
            <VerticalSliderInner
              sliderSize={sliderSize}
              sliderColor={sliderColor}
              style={{ height: state.vertical.size - (trackPadding * 2 + sliderSize * 2) }}
            />
          </VerticalSlider>
        </VerticalTrack>
      )}
      {state.horizontal.show && (
        <HorizontalTrack
          data-sb-scrollbar-track=""
          trackPadding={trackPadding + sliderSize}
          style={{ top: horizontalTop, left: 0, width: outerWidth }}
        >
          <HorizontalSlider
            data-sb-scrollbar-slider=""
            trackPadding={trackPadding}
            style={{
              transform: `translateX(${state.horizontal.position}px)`,
              width: state.horizontal.size,
            }}
          >
            <HorizontalSliderInner sliderColor={sliderColor} sliderSize={sliderSize} />
          </HorizontalSlider>
        </HorizontalTrack>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div({
  position: 'relative',
});

const ScrollController = styled.div({
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
    '& ~ [data-sb-scrollbar-track]': {
      opacity: 0.8,
    },
  },
});

const ScrollInner = styled.div({
  display: 'inline-block',
});

interface TrackProps {
  trackPadding: number;
}

const Track = styled.div<TrackProps>({
  position: 'absolute',
  opacity: 0,
  overflow: 'hidden',
  transition: 'opacity 200ms ease-in-out',
  '&:hover': {
    opacity: 0.8,
  },
});

const HorizontalTrack = styled(Track)(({ trackPadding }) => ({
  paddingTop: trackPadding,
  paddingBottom: trackPadding,
}));

const VerticalTrack = styled(Track)(({ trackPadding }) => ({
  paddingLeft: trackPadding,
  paddingRight: trackPadding,
}));

const VerticalSlider = styled.div({
  display: 'flex',
  alignItems: 'center',
});

interface HorizontalSliderProps {
  trackPadding: number;
}

const HorizontalSlider = styled.div<HorizontalSliderProps>(({ trackPadding }) => ({
  position: 'relative',
  paddingLeft: trackPadding * 2,
  paddingRight: trackPadding * 2,
}));

interface SliderInnerProps {
  sliderSize: number;
  sliderColor?: string;
}

const SliderInner = styled.div<SliderInnerProps>(({ theme, sliderColor }) => ({
  position: 'relative',
  backgroundColor: sliderColor || theme.color.secondary,
}));

interface SliderPointerProps {
  sliderSize: number;
  sliderColor?: string;
  position: 'start' | 'end';
}

const SliderPointer = styled.div<SliderPointerProps>(({ theme, sliderColor, sliderSize }) => ({
  backgroundColor: sliderColor || theme.color.secondary,
  width: sliderSize,
  height: sliderSize,
  borderRadius: '100%',
}));

const HorizontalSliderInner = styled(SliderInner)(({ sliderSize }) => ({
  width: '100%',
  height: sliderSize,
  '&::before': {
    content: ' ',
    position: 'relative',
    top: 0,
    left: 0,
    height: sliderSize,
    width: sliderSize,
    borderRadius: '100%',
  },
  '&::after': {},
}));

const VerticalSliderInner = styled(SliderInner)(({ sliderSize }) => ({
  width: sliderSize,
}));
