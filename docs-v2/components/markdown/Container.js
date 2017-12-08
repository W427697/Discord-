import glamorous from 'glamorous';
import { baseFonts, monoFonts } from '@storybook/components';

import { styles as headingStyles } from './Heading';

const a = {
  fontWeight: 500,
  color: 'currentColor',
  '&:hover, &:focus, &:active': {
    color: 'currentColor',
  },
};
const p = {
  color: 'currentColor',
  fontWeight: 'normal',
  fontSize: 15,
  marginTop: 0,
  marginBottom: '1.2em',
  lineHeight: '1.4em',
  '&:last-child': {
    marginBottom: 0,
  },
};
const blockquote = {
  background: 'rgba(109, 171, 245, 0.1)',
  margin: 0,
  padding: 20,
  marginBottom: '1.2em',
};
const ul = {
  margin: 0,
  padding: 0,
  paddingLeft: '1.2em',
  'list-style-type': 'circle',
  marginBottom: '1.2em',
};
const ol = {
  margin: 0,
  padding: 0,
  paddingLeft: '2.45em',
  'list-style-type': 'decimal-leading-zero',
  marginBottom: '1.2em',
  fontFamily: monoFonts.fontFamily,
  '& > li > *': {
    fontFamily: baseFonts.fontFamily,
  },
};

const li = {
  '& + li': {
    marginTop: 10,
  },
};

const Container = glamorous.div(
  {
    ':root & h1, :root & h2, :root & h3, :root & h4, :root & h5, :root & h6': {
      marginTop: -80, // this will make browser scroll-to behavior to be 80px off
      paddingTop: 80, // ensuring the header will not be covered by the sticky header
      marginBottom: '0.7em',
    },
    ':root & * + h1, :root & * + h2, :root & * + h3, :root & * + h4, :root & * + h5, :root & * + h6': {
      marginTop: -50, // this will make browser scroll-to behavior to be 80px off
    },
    ':root & h1 + h2, :root & h2 + h3, :root & h3 + h4, :root & h4 + h5, :root & h5 + h6': {
      marginTop: -80, // this will make browser scroll-to behavior to be 80px off
    },
    '& h1': headingStyles.h1,
    '& h2': headingStyles.h2,
    '& h3': headingStyles.h3,
    '& a': a,
    '& p': p,
    '& blockquote': blockquote,
    '& ul': ul,
    '& ol': ol,
    '& li': li,
    '& li > p': {
      marginBottom: 0,
    },
  },
  {
    '& a': {
      textDecoration: 'none',
      backgroundRepeat: 'repeat-x',
      backgroundSize: '100% 2px',
      backgroundPosition: '0 100%',
      transition: 'all 0.01s linear',
      paddingBottom: 2,
      '&:hover': {
        'background-position-x': 1200,
        transitionDuration: '7s',
      },
    },
  },
  ({ colored = true }) =>
    colored
      ? {
          '& a': {
            backgroundImage:
              'linear-gradient(to right, rgba(181,126,229,1) 0%,rgba(241,97,140,1) 37%,rgba(243,173,56,1) 100%)',
          },
        }
      : {
          '& a': {
            backgroundImage: 'linear-gradient(-90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          },
        }
);
Container.displayName = 'Markdown.Container';

export const A = glamorous.a(a);
a.displayName = 'Markdown.A';

export const P = glamorous.p(p);
P.displayName = 'Markdown.P';

export const Ol = glamorous.ol(ol);
Ol.displayName = 'Markdown.Ol';

export const Ul = glamorous.ul(ul);
Ul.displayName = 'Markdown.Ul';

export const Li = glamorous.li(li);
Li.displayName = 'Markdown.Li';

export { Container as default };
