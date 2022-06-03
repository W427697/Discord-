import { recipe } from '@vanilla-extract/recipes';

export const text = recipe({
  base: {
    fontSize: 'medium',
  },

  variants: {
    variant: {
      body: {
        color: 'text',
        fontSize: 'medium',
      },
      caption: {
        color: 'muted',
        fontSize: 'small',
      },
    },
  },

  defaultVariants: {
    variant: 'body',
  },
});
