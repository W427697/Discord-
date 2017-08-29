import glamorous from 'glamorous';

export const styles = {
  h1: {
    color: 'currentColor',
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.19)',
    fontWeight: 300,
    fontSize: 26,
  },
  h2: {
    color: 'currentColor',
    fontWeight: 400,
    fontSize: 22,
    borderBottom: '1px solid currentColor',
  },
  h3: {
    color: 'currentColor',
    fontWeight: 700,
    fontSize: 16,
  },
};

export const H1 = glamorous.h1(styles.h1);
export const H2 = glamorous.h2(styles.h2);
export const H3 = glamorous.h3(styles.h3);
