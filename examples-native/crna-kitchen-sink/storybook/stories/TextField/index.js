import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
});

class TextField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  handleChangeText = value => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <TextInput
        autoCapitalize="none"
        onChangeText={this.handleChangeText}
        placeholderTextColor="#CCC"
        style={styles.container}
        underlineColorAndroid="transparent"
        value={value}
        {...this.props}
      />
    );
  }
}

TextField.defaultProps = {
  value: '',
};

TextField.propTypes = {
  value: PropTypes.string,
};

export default TextField;
