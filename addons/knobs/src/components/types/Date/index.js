import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '25px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#444',
  flex: 1,
};

const formatDate = date => {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};
const formatTime = date => {
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);

  return `${hours}:${minutes}`;
};

const DateType = ({ knob, onChange }) => {
  const { name } = knob;
  const date = new Date(knob.value);

  return name ? (
    <div style={{ display: 'flex' }}>
      <input
        style={styles}
        type="date"
        id={`${name}date`}
        value={formatDate(date)}
        onChange={e => {
          const [year, month, day] = e.target.value.split('-');
          const result = new Date(date);
          result.setFullYear(parseInt(year, 10));
          result.setMonth(parseInt(month, 10) - 1);
          result.setDate(parseInt(day, 10));
          onChange(result);
        }}
      />
      <input
        style={styles}
        type="time"
        id={`${name}time`}
        value={formatTime(date)}
        onChange={e => {
          const [hours, minutes] = e.target.value.split(':');
          const result = new Date(date);
          result.setHours(parseInt(hours, 10));
          result.setMinutes(parseInt(minutes, 10));
          onChange(result);
        }}
      />
    </div>
  ) : null;
};

DateType.defaultProps = {
  knob: {},
  onChange: value => value,
};

DateType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

DateType.serialize = value =>
  console.log('serialize input:', value) || new Date(value).getTime() || new Date().getTime();
DateType.deserialize = value =>
  console.log('deserialize input:', value) || new Date(value).getTime() || new Date().getTime();

export default DateType;
