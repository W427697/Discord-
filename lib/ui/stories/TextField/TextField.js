// @flow
import React, { Component, Fragment } from 'react';
import '@material/textfield/dist/mdc.textfield.min.css';
import { MDCTextField } from '@material/textfield/dist/mdc.textfield.min';

type Props = {
  label: string,
  name: string,
  type?: string,
  id?: string,
  fullWidth?: boolean,
  value?: string,
  required?: boolean,
  disabled?: boolean,
  helpText?: string,
  validator?: (value: string) => Promise<string>,
  onChange: (event: Event, err: boolean) => void,
};

class TextField extends Component<Props> {
  static defaultProps = {
    disabled: false,
    required: false,
    value: '',
    type: 'text',
    helpText: undefined,
    validator: undefined,
    fullWidth: false,
    id: undefined,
    onChange: undefined,
  };

  componentDidMount() {
    if (this.ref) {
      this.textField = new MDCTextField(this.ref);
    }
  }

  componentDidUpdate() {
    if (this.input) {
      if (this.props.validator && this.input.value !== '') {
        return this.props
          .validator(this.input.value)
          .then(() => {
            if (this.input) this.input.setCustomValidity('');
          })
          .catch(e => {
            if (this.input) this.input.setCustomValidity(e);
          });
      }
      this.input.setCustomValidity('');
    }
  }

  onChange = (e: Event) => {
    const { onChange, required } = this.props;
    const value: ?string = e.target.value;
    const hasValue: boolean = Boolean(value && value.length !== 0);
    if (onChange) onChange(e, !!required && !hasValue);
  };

  labelClick = () => {
    if (this.input) this.input.focus();
  };

  ref: ?HTMLDivElement;
  input: ?HTMLInputElement;
  textField: MDCTextField;
  label: ?HTMLLabelElement;
  render = () => {
    const {
      id,
      name,
      label,
      type,
      fullWidth,
      value,
      required,
      disabled,
      helpText,
      ...props
    } = this.props;
    const fullWidthClass: string = fullWidth ? 'mdc-text-field--fullwidth' : '';
    const disabledClass: string = disabled ? 'mdc-text-field--disabled' : '';
    const mainClass: string = `mdc-text-field ${fullWidthClass} ${disabledClass}`.trim();
    const hasValue: boolean = Boolean(value && value.length !== 0);
    const fixedLabelClass: string =
      hasValue || document.activeElement === this.input ? 'mdc-text-field__label--float-above' : '';
    const labelClass: string = `mdc-text-field__label ${fixedLabelClass}`.trim();

    return (
      <Fragment>
        <div
          ref={e => {
            this.ref = e;
          }}
          className={mainClass}
        >
          <input
            ref={input => {
              this.input = input;
            }}
            id={id}
            type={type}
            name={name}
            style={{ outline: 'none' }}
            className="mdc-text-field__input"
            value={value}
            onChange={this.onChange}
            required={required}
            disabled={disabled}
            onBlur={() => {
              if (!hasValue && this.label) {
                this.label.classList.remove('mdc-text-field__label--float-above');
              }
            }}
            {...props}
          />
          <label
            role="presentation"
            ref={label => {
              this.label = label;
            }}
            onClick={this.labelClick}
            className={labelClass}
            htmlFor={id}
          >
            {label}
          </label>
        </div>
        {helpText && (
          <p className="mdc-text-field-helper-text" aria-hidden="false">
            {helpText}
          </p>
        )}
      </Fragment>
    );
  };
}

export default TextField;
