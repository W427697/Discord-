import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const Form = ({ onSuccess }) => {
  const [value, setValue] = useState('');
  const [succeed, setSucceed] = useState(false);
  const [error, setError] = useState(null);

  function onSubmit(event) {
    event.preventDefault();
    if (succeed) {
      setError(null);
      onSuccess(value);
    } else {
      setTimeout(() => {
        setError(`Submitted '${value}' when not allowed!`);
      }, 1000);
    }
  }

  return (
    <form id="interaction-test-form" onSubmit={onSubmit}>
      <style>{`
        #interaction-test-form button:hover {
          background: red;
        }
      `}</style>
      <label>
        Enter Value
        <input
          type="text"
          data-testid="value"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <label>
        Should succeed?
        <input
          type="checkbox"
          data-testid="succeed"
          value={succeed}
          onChange={(event) => setSucceed(event.target.checked)}
        />
      </label>
      <button type="submit">Submit</button>
      {error && <p data-testid="error">{error}</p>}
    </form>
  );
};

Form.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
