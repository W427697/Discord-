/* eslint-disable no-underscore-dangle */
import React, { PureComponent } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Modal,
  View,
  PanResponder,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import style from './style';

export default class AddonWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY({
        x: Math.floor(Dimensions.get('window').width * 0.05),
        y: Math.floor(Dimensions.get('window').height * 0.3),
      }),
      resize: new Animated.ValueXY({
        x: Math.floor(Dimensions.get('window').width * 0.9),
        y: Math.floor(Dimensions.get('window').height * 0.3),
      }),
    };

    this.shouldAnimateOnHide = false;
    this.shouldResizeOnHide = false;
    this.lastPosition = 0;
    this.lastResize = 0;
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this.keyboardWillShow
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this.keyboardWillHide
      );
    } else {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    }

    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Set the initial value to the current state
        this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderRelease: () => {
        // Flatten the offset to avoid erratic behavior
        this.shouldAnimateOnHide = false;
        this.state.pan.flattenOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: this.state.pan.x, dy: this.state.pan.y }]),
    });

    this.resizeResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Set the initial value to the current statex
        this.initialResize = { x: this.state.resize.x._value, y: this.state.resize.y._value };
        this.state.resize.setOffset({
          x: this.state.resize.x._value,
          y: this.state.resize.y._value,
        });
        this.state.resize.setValue({ x: 0, y: 0 });
      },
      onPanResponderRelease: () => {
        // Flatten the offset to avoid erratic behavior
        this.shouldResizeOnHide = false;
        this.state.resize.flattenOffset();
      },
      onPanResponderMove: (evt, gestureState) => {
        Animated.event([null, { dx: this.state.resize.x, dy: this.state.resize.y }])(evt, {
          dx:
            this.initialResize.x + gestureState.dx >= 100
              ? gestureState.dx
              : this.state.resize.x._value,
          dy:
            this.initialResize.y + gestureState.dy >= 100
              ? gestureState.dy
              : this.state.resize.y._value,
        });
      },
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardWillShow = event => {
    this.shouldAnimateOnHide = false;
    this.shouldResizeOnHide = false;

    const screenSizeWithoutKeyboard = Dimensions.get('window').height - event.endCoordinates.height;
    const lowestPointOfModal = this.state.pan.y._value + this.state.resize.y._value;

    if (screenSizeWithoutKeyboard < lowestPointOfModal) {
      this.shouldAnimateOnHide = true;
      this.lastPosition = this.state.pan.y._value;
      const heightUnder = lowestPointOfModal - screenSizeWithoutKeyboard;
      const shouldAnimateTo = this.state.pan.y._value - heightUnder - 20;

      const shouldResizeBy = shouldAnimateTo < 10 ? 10 - shouldAnimateTo : 0;

      Animated.timing(this.state.pan, {
        duration: event.duration || 100,
        toValue: { y: shouldAnimateTo < 10 ? 10 : shouldAnimateTo, x: this.state.pan.x._value },
      }).start();

      if (shouldResizeBy) {
        this.shouldResizeOnHide = true;
        this.lastResize = this.state.resize.y._value;

        Animated.timing(this.state.resize, {
          duration: event.duration || 100,
          toValue: {
            y: this.state.resize.y._value - shouldResizeBy,
            x: this.state.resize.x._value,
          },
        }).start();
      }
    }
  };

  keyboardWillHide = event => {
    if (this.shouldAnimateOnHide) {
      Animated.timing(this.state.pan, {
        duration: event.duration,
        toValue: { y: this.lastPosition, x: this.state.pan.x._value },
      }).start();
    }
    if (this.shouldResizeOnHide) {
      Animated.timing(this.state.resize, {
        duration: event.duration,
        toValue: { y: this.lastResize, x: this.state.resize.x._value },
      }).start();
    }
  };

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };

    const modalSize = {
      height: this.state.resize.y,
      width: this.state.resize.x,
    };

    return (
      <View>
        <Modal visible={this.props.visible} transparent onRequestClose={this.props.onClose}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={style.flex}
          >
            <TouchableWithoutFeedback onPress={this.props.onClose}>
              <View style={style.modalContainer}>
                <Animated.View
                  {...this.panResponder.panHandlers}
                  style={[panStyle, style.addonBox, modalSize]}
                >
                  <View style={style.topBar} />
                  <View style={style.flex}>{this.props.children}</View>
                  <View style={style.bottomBar}>
                    <Animated.View
                      {...this.resizeResponder.panHandlers}
                      style={style.resizeButton}
                    />
                  </View>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }
}

AddonWrapper.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
