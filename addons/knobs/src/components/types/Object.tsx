import React, { Component, Validator } from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import deepEqual from 'fast-deep-equal';
import { polyfill } from 'react-lifecycles-compat';
import { KnobControlConfig, KnobControlProps } from './types';

export type ObjectTypeKnob<T> = KnobControlConfig<T>;
type ObjectTypeProps<T> = KnobControlProps<T>;

interface ObjectTypeState<T> {
  value: string;
  json?: T;
}

class ObjectType<T> extends Component<ObjectTypeProps<T>> {
  static propTypes = {
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    }).isRequired as Validator<ObjectTypeProps<any>['knob']>,
    onChange: PropTypes.func.isRequired as Validator<ObjectTypeProps<any>['onChange']>,
  };

  static defaultProps: ObjectTypeProps<any> = {
    knob: {} as any,
    onChange: (value: Record<string, any>) => value,
  };

  static serialize: { <T>(object: T): string } = (object) => JSON.stringify(object);

  static deserialize: { <T>(value: string): T } = (value) => (value ? JSON.parse(value) : {});

  static getDerivedStateFromProps<T>(
    props: ObjectTypeProps<T>,
    state: ObjectTypeState<T>
  ): ObjectTypeState<T> | null {
    if (!deepEqual(props.knob.value, state.json)) {
      try {
        return {
          value: JSON.stringify(props.knob.value, null, 2),
          json: props.knob.value,
        };
      } catch (e) {
        return { value: 'Object cannot be stringified' };
      }
    }
    return null;
  }

  state: ObjectTypeState<T> = {
    value: '',
    json: {} as any,
  };

  // TODO: fix types
  handleChange = ({ existing_value, new_value, updated_src }: any) => {
    const { onChange } = this.props;

    if (existing_value !== new_value) {
      this.setState({
        value: JSON.stringify(updated_src),
        json: updated_src,
      });
      onChange(updated_src);
    }
  };

  render() {
    const { value } = this.state;
    const { knob } = this.props;
    return (
      <ReactJson
        name={knob.name}
        onEdit={this.handleChange}
        theme="summerfruit:inverted"
        src={JSON.parse(value)}
      />
    );
  }
}

polyfill(ObjectType as any);

export default ObjectType;
