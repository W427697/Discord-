import { styled } from '@storybook/theming';

type BadgeWrapperProps = BadgeProps;

export const Badge = styled.div<BadgeWrapperProps>(
  ({ theme }) => ({
    display: 'inline-block',
    fontSize: '11px',
    lineHeight: '12px',
    alignSelf: 'center',
    padding: '4px 12px',
    borderRadius: '3em',
    fontWeight: theme.typography.weight.bold,
  }),
  {
    svg: {
      height: '12px',
      width: '12px',
      marginRight: '4px',
      marginTop: '-2px',
    },
    path: {
      fill: 'currentColor',
    },
  },
  ({ theme, status }) => {
    switch (status) {
      case 'critical': {
        return {
          color: theme.color.critical,
          background: theme.background.critical,
        };
      }
      case 'negative': {
        return {
          color: theme.color.negative,
          background: theme.background.negative,
        };
      }
      case 'warning': {
        return {
          color: theme.color.warning,
          background: theme.background.warning,
        };
      }
      case 'neutral': {
        return {
          color: theme.color.dark,
          background: theme.color.mediumlight,
        };
      }
      case 'positive': {
        return {
          color: theme.color.positive,
          background: theme.background.positive,
        };
      }
      default: {
        return {};
      }
    }
  }
);

export interface BadgeProps {
  status: 'positive' | 'negative' | 'neutral' | 'warning' | 'critical';
}
