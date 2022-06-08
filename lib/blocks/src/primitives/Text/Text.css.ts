import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { fromPairs } from 'lodash';
import { Sprinkles, sprinkles } from '../sprinkles.css';
import { vars } from '../theme.css';

export const tones = {
  neutral: sprinkles({
    color: 'text',
  }),
  muted: sprinkles({
    color: 'muted',
  }),
  emphasis: {
    fontStyle: 'italic',
  },
  loud: [
    {
      fontStyle: 'normal',
    },
    sprinkles({ fontWeight: 'bold' }),
  ],
};

export const sizes = fromPairs(
  Object.keys(vars.fontSizes).map((key) => [
    key,
    sprinkles({ fontSize: key as Sprinkles['fontSize'] }),
  ])
) as Record<keyof typeof vars.fontSizes, string>;

export const getRecipe = recipe({
  base: { margin: 0 },

  variants: {
    tone: tones,
    size: sizes,
  },
});

export type TextVariants = RecipeVariants<typeof getRecipe>;
