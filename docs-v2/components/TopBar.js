import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const Bar = glamorous.nav(
  {
    position: 'fixed',
    left: -10,
    top: 0,
    right: -10,
    bottom: 'auto',
    padding: '12px 22px',
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    boxShadow: '0 0 30px rgba(0,0,0,0.3)',
    height: 50,
    backgroundImage:
      'linear-gradient(to bottom, rgba(255,255,255, 1) 0%, rgba(244,244,244, 0.94) 100%)',
    '@media screen and (min-width: 501px)': {
      padding: '12px 22px',
    },
    '@media screen and (max-width: 500px)': {
      padding: '8px 16px',
    },
  },
  ({ active }) => ({
    zIndex: active ? 1001 : 999,
  })
);

Bar.displayName = 'Bar';
Bar.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
};
Bar.defaultProps = {
  active: false,
  children: null,
};

export default Bar;
