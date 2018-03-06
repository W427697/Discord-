import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const Badge = glamorous.em({
  display: 'inline-block',
  padding: '2px 5px',
  background: '#f16161',
  borderRadius: '0 3px 0 3px',
  fontSize: 13,
  fontStyle: 'normal',
  color: 'white',
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  float: 'left',
  position: 'absolute',
  top: 0,
  right: 0,
});

Badge.displayName = 'Badge';
Badge.propTypes = {
  children: PropTypes.node,
};
Badge.defaultProps = {
  children: '',
};

export default Badge;
