import { style } from '@vanilla-extract/css';

export const ColorSwatchStyles = style({
  position: 'relative',
  height: '70px',
  backgroundImage: `
    linear-gradient(45deg, rgba(0,0,0,.125) 25%, transparent 25%), 
    linear-gradient(-45deg, rgba(0,0,0,.125) 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, rgba(0,0,0,.125) 75%), 
    linear-gradient(-45deg, transparent 75%, rgba(0,0,0,.125) 75%)`,
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
});
