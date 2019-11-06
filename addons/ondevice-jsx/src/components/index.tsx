import React from 'react';
import { View, TouchableOpacity, Clipboard } from 'react-native';
import styled from '@emotion/native';

const Label = styled.Text(({ theme }) => ({
  color: theme.labelColor,
  fontSize: 12,
  letterSpacing: 1,
}));

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
      <View style={{ flex: 1, padding: 10 }}>
        <View style={{ flex: 1 }}>
          {storySource.split('\n').map((item, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <Label key={idx}>{item}</Label>
          ))}
        </View>
        <View style={{ position: 'absolute', right: 5, top: 5 }}>
          <TouchableOpacity onPress={this.onPressCopy}>
            <Label style={{ fontSize: 14 }}>COPY</Label>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
