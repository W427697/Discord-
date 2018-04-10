// @flow
import React from 'react';
import '@material/radio/dist/mdc.radio.min.css';
import '@material/form-field/dist/mdc.form-field.min.css';

type Props = { label: string, id: string, name: string, value: string };

const Radio: React$ComponentType<Props> = ({ label, id, name, value }) => (
  <div className="mdc-form-field">
    <div className="mdc-radio">
      <input className="mdc-radio__native-control" type="radio" id={id} name={name} value={value} />
      <div className="mdc-radio__background">
        <div className="mdc-radio__outer-circle" />
        <div className="mdc-radio__inner-circle" />
      </div>
    </div>
    {label && <label htmlFor={id}>{label}</label>}
  </div>
);

export default Radio;
