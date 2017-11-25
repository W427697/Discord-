import glamorous from 'glamorous';

import { styles as headingStyles } from './Heading';

const a = {
  borderBottom: '1px dashed currentColor',
  textDecoration: 'none',
  transition: 'color 0.3s',
  '&:hover, &:focus, &:active': {
    outline: 0,
    borderBottomStyle: 'solid',
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
    '& li': li,
    '& li > p': {
      marginBottom: 0,
    },
  },
  ({ colored = true }) =>
    colored
      ? {
          '& a': {
            color: 'rgb(240, 97, 141)',
            '&:hover, &:focus, &:active': {
              color: 'rgb(181, 126, 229)',
            },
          },
        }
      : {
          '& a': {
            color: 'currentColor',
            '&:hover, &:focus, &:active': {
              color: 'currentColor',
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
