// @flow
import React, { Fragment } from 'react';
import '@material/switch/dist/mdc.switch.min.css';

type Props = {
  label?: string,
  value: boolean,
  onChange: (e: Event) => void,
  id?: string,
  name?: string,
};

const Switch: React$ComponentType<Props> = ({ label, value, onChange, id, name }) => (
  <Fragment>
    <div className="mdc-switch">
      <input
        type="checkbox"
        className="mdc-switch__native-control"
        checked={value}
        onChange={onChange}
        id={id}
        name={name}
      />
      <div className="mdc-switch__background">
        <div className="mdc-switch__knob" />
      </div>
    </div>
    {label && (
      <label htmlFor={id} className="mdc-switch-label">
        {label}
      </label>
    )}
  </Fragment>
);

export default Switch;
