import glamorous from 'glamorous';

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

const ul = {
  margin: 0,
  padding: 0,
  paddingLeft: '1.2em',
};
const ol = {
  margin: 0,
  padding: 0,
  paddingLeft: '1.2em',
};

const li = {
  '& + li': {
    marginTop: 10,
  },
};

const Container = glamorous.div(
  {
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      marginTop: -80, // this will make browser scroll-to behavior to be 80px off
      paddingTop: 80, // ensuring the header will not be covered by the sticky header
      marginBottom: '0.6em',
    },
    '& h1': headingStyles.h1,
    '& h2': headingStyles.h2,
    '& h3': headingStyles.h3,
    '& a': a,
    '& p': p,
    '& ul': ul,
    '& ol': ol,
    '& li': li,
    '& li > p': {
      marginBottom: 0,
    },
  },
  ({ colored = true }) =>
    colored
      ? {
          '& a': {
            textDecoration: 'none',
            backgroundImage:
              'linear-gradient(to right, rgba(181,126,229,1) 0%,rgba(241,97,140,1) 37%,rgba(243,173,56,1) 100%)',
            backgroundRepeat: 'repeat-x',
            backgroundSize: '100% 2px',
            backgroundPosition: '0 100%',
            transition: 'all 0.25s ease-in',
            '&:hover': {
              backgroundSize: '100vw 2px',
            },
          },
        }
      : {
          '& a': {
            textDecoration: 'none',
            backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
            backgroundRepeat: 'repeat-x',
            backgroundSize: '100% 2px',
            backgroundPosition: '0 100%',
            transition: 'all 0.25s ease-in',
            '&:hover': {
              backgroundSize: '100vw 2px',
            },
          },
        }
);
Container.displayName = 'Markdown.Container';

export const A = glamorous.a(a);
a.displayName = 'Markdown.A';

export const P = glamorous.p(p);
P.displayName = 'Markdown.P';

export { Container as default };
