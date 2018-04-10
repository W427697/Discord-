// @flow
import React from 'react';
import '@material/checkbox/dist/mdc.checkbox.min.css';

type Props = {
  onChange: (e: Event) => void,
  checked?: boolean,
  label?: string,
  id?: string,
  name?: string,
};

const Checkbox: React$ComponentType<Props> = ({ onChange, checked, label, id, name }) => (
  <div style={label && { lineHeight: '40px' }}>
    <div className="mdc-checkbox">
      <input
        id={id}
        name={name}
        type="checkbox"
        className="mdc-checkbox__native-control"
        checked={checked}
        onChange={onChange}
      />
      <div className="mdc-checkbox__background">
        <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
          <path
            className="mdc-checkbox__checkmark__path"
            fill="none"
            stroke="white"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"
          />
        </svg>
        <div className="mdc-checkbox__mixedmark" />
      </div>
    </div>
    {label && <label htmlFor={id}>{label}</label>}
  </div>
);

export default Checkbox;
