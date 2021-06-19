import { styled, Theme } from '@storybook/theming';

interface WrapperProps {
  absolute: boolean;
}

export const Wrapper = styled.div<WrapperProps>(
  {
    position: 'relative',
    overflow: 'hidden',
  },
  ({ absolute }) =>
    absolute
      ? {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }
      : { display: 'flex' }
);

interface ScrollableContainerProps {
  absolute: boolean;
  parentWidth: number;
  parentHeight: number;
}

export const ScrollableContainer = styled.div<ScrollableContainerProps>(
  {
    overflowX: 'scroll',
    overflowY: 'scroll',
    /* Hide scrollbar for IE, Edge and Firefox */
    msOverflowStyle: 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */,
    /* Hide scrollbar for Chrome, Safari and Opera */
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  ({ absolute }) =>
    absolute
      ? {
          display: 'grid',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }
      : {}
);

interface ScrollableContentProps {
  absolute: boolean;
}

export const ScrollableContent = styled.div<ScrollableContentProps>(({ absolute }) =>
  absolute
    ? {
        display: 'inline-block',
        width: '100%',
      }
    : {
        flexGrow: 1,
        display: 'inline-block',
      }
);

interface TrackProps {
  sliderPadding: number;
  sliderOpacity: number;
  showOn: 'always' | 'hover' | 'scroll' | 'never' | 'scroll';
  show: boolean;
}

export const Track = styled.div<TrackProps>(({ showOn, sliderOpacity, show }) => ({
  position: 'absolute',
  opacity: showOn === 'always' || show === true ? sliderOpacity : 0,
  transition: 'opacity 275ms ease-in-out',
}));

export const HorizontalTrack = styled(Track)(({ sliderPadding }) => ({
  paddingTop: sliderPadding,
  paddingBottom: sliderPadding,
}));

export const VerticalTrack = styled(Track)(({ sliderPadding }) => ({
  paddingLeft: sliderPadding,
  paddingRight: sliderPadding,
}));

interface SliderProps {
  sliderColor?: string;
  sliderType?: keyof Theme['color'];
  sliderSize: number;
}

export const Slider = styled.div<SliderProps>(({ theme, sliderColor, sliderType, sliderSize }) => ({
  backgroundColor: sliderType ? theme.color[sliderType] : sliderColor,
  borderTopLeftRadius: sliderSize / 2,
  borderTopRightRadius: sliderSize / 2,
  borderBottomLeftRadius: sliderSize / 2,
  borderBottomRightRadius: sliderSize / 2,
  cursor: 'grabbing',
}));

export const VerticalSlider = styled(Slider)(({ sliderSize }) => ({
  width: sliderSize,
}));

export const HorizontalSlider = styled(Slider)(({ sliderSize }) => ({
  height: sliderSize,
}));
