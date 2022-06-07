import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { sprinkles } from '../sprinkles.css';

export const variants = {
  title: sprinkles({
    color: 'text',
    fontSize: 'x-large',
    fontWeight: 'bold',
  }),
  body: sprinkles({
    color: 'text',
    fontSize: 'medium',
  }),
  emphasis: [
    {
      color: 'inherit',
      fontSize: 'inherit',
    },
    sprinkles({
      fontWeight: 'bold',
    }),
  ],
  caption: sprinkles({
    color: 'muted',
    fontSize: 'small',
  }),
};

export const getRecipe = recipe({
  variants: {
    variant: variants,
  },
});

export type TextVariants = RecipeVariants<typeof getRecipe>;
