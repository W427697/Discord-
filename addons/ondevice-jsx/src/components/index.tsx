import React from 'react';
import { View, TouchableOpacity, Clipboard, Text } from 'react-native';

interface Props {
  storySource: string;
}

export default class JSX extends React.PureComponent<Props> {
  onPressCopy = () => {
    const { storySource } = this.props;

    Clipboard.setString(storySource);
  };

  render() {
    const { storySource } = this.props;

    return (
      <View style={style.wrapper}>
        <View style={{ flex: 1 }}>
          {storySource.split('\n').map((item, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <Text style={style.text} key={idx}>
              {item}
            </Text>
          ))}
        </View>
        <View style={{ position: 'absolute', right: 5, top: 5 }}>
          <TouchableOpacity onPress={this.onPressCopy}>
            <Text>COPY</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const style = {
  text: {
    color: 'rgb(68, 68, 68)',
    fontSize: 12,
    letterSpacing: 1,
  },
  wrapper: {
    flex: 1,
    padding: 10,
  },
};
