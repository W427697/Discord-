import { baseFonts } from '../theme';

export default theme => ({
  empty: {
    flex: 1,
    display: 'flex',
    ...baseFonts,
    color: theme.palette.text,
    fontSize: 11,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    alignItems: 'center',
    justifyContent: 'center',
  },

  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.canvas,
    borderRadius: 4,
    border: `solid 1px ${theme.palette.border}`,
    marginTop: 5,
    width: '100%',
  },

  tabbar: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottom: `solid 1px ${theme.palette.secondaryBorder}`,
  },

  content: {
    flex: 1,
    display: 'flex',
    overflow: 'auto',
  },

  tablink: {
    ...baseFonts,
    fontSize: 11,
    letterSpacing: '1px',
    padding: '10px 15px',
    textDecoration: 'none',
    textTransform: 'uppercase',
    transition: 'opacity 0.3s',
    opacity: 0.5,
    maxHeight: 60,
    overflow: 'hidden',
    cursor: 'pointer',
  },

  activetab: {
    opacity: 1,
  },
});
