import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { sprinkles } from '../../primitives/sprinkles.css';

export const getRecipe = recipe({
  base: sprinkles({ borderRadius: 'small', borderColor: 'border' }),
  variants: {
    appearance: {
      elevated: sprinkles({
        padding: 'none',
        border: 'thin',
        boxShadow: 'small',
        background: 'background',
      }),
      empty: sprinkles({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'large',
        fontSize: 's2',
        color: 'muted',
        border: 'dashed',
        boxShadow: 'none',
        background: 'backdrop',
      }),
    },
  },

  defaultVariants: {
    appearance: 'elevated',
  },
});

export type BlockVariants = RecipeVariants<typeof getRecipe>;
