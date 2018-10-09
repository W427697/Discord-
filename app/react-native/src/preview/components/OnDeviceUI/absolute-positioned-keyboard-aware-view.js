import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Platform, Keyboard, Dimensions, View } from 'react-native';

import style from './style';

export default class AbsolutePositionedKeyboardAwareView extends PureComponent {
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    Dimensions.addEventListener('change', this.removeKeyboardOnOrientationChange);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    Dimensions.removeEventListener('change', this.removeKeyboardOnOrientationChange);
  }

  keyboardDidShow = e => {
    // There is bug in RN that it calles this method if you simply go from portrait to landscape.
    // So we enable keyboard check only when keyboard actually opens
    if (Platform.OS === 'android') {
      const { previewWidth } = this.state;
      if (previewWidth === e.endCoordinates.width) {
        this.keyboardOpen = true;
      }
    }
  };

  // When rotating screen from portrait to landscape with keyboard open on android it calls keyboardDidShow, but doesn't call
  // keyboardDidhide. To avoid issues we set keyboardOpen to false imediatelly on keyboardChange
  removeKeyboardOnOrientationChange = () => {
    if (Platform.OS === 'android') {
      this.keyboardOpen = false;
    }
  };

  keyboardDidHide = () => {
    if (this.keyboardOpen) {
      this.keyboardOpen = false;
    }
  };

  onLayout = ({ nativeEvent }) => {
    if (!this.keyboardOpen) {
      const { width, height } = nativeEvent.layout;
      const { onLayout } = this.props;

      onLayout({
        previewHeight: height,
        previewWidth: width,
      });
    }
  };

  render() {
    const { children, previewWidth, previewHeight } = this.props;

    return (
      <View style={style.flex} onLayout={this.onLayout}>
        <View
          style={
            previewWidth === 0
              ? style.flex
              : { position: 'absolute', width: previewWidth, height: previewHeight }
          }
        >
          {children}
        </View>
      </View>
    );
  }
}

AbsolutePositionedKeyboardAwareView.propTypes = {
  children: PropTypes.node.isRequired,
  previewWidth: PropTypes.number.isRequired,
  previewHeight: PropTypes.number.isRequired,
  onLayout: PropTypes.func.isRequired,
};
