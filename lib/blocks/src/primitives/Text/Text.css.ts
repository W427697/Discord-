import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../theme.css';

export const text = recipe({
  base: {
    fontSize: vars.fontSizes.medium,
  },

  variants: {
    variant: {
      body: {
        color: vars.colors.text,
        fontSize: vars.fontSizes.medium,
      },
      caption: {
        color: vars.colors.muted,
        fontSize: vars.fontSizes.small,
      },
    },
  },

  defaultVariants: {
    variant: 'body',
  },
});
