import React from 'react';
import { Typeset } from './Typeset';

export default {
  component: Typeset,
};

const letterSpacing = '0.15px';
const lineHeight = '48px';
const fontSizes = ['12px', '14px', '16px', '20px', '24px', '32px', '40px', '48px'];
const fontWeight = 900;
const fontFamily = 'monospace';

export const WithFontSizes = () => <Typeset fontSizes={fontSizes} />;

export const WithLetterSpacing = () => (
  <Typeset fontSizes={fontSizes} letterSpacing={letterSpacing} />
);

export const WithLineHeight = () => <Typeset fontSizes={fontSizes} lineHeight={lineHeight} />;

export const WithFontWeight = () => <Typeset fontSizes={fontSizes} fontWeight={fontWeight} />;

export const WithFontFamily = () => <Typeset fontSizes={fontSizes} fontFamily={fontFamily} />;

export const WithWeightText = () => (
  <Typeset fontSizes={fontSizes} fontWeight={fontWeight} sampleText="Heading" />
);
