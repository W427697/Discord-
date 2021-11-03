import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

export default {
  title: 'Basic',
};

export const Main = ({ text = 'default text' }: { text: string }) => {
  return (
    <View>
      <Text>{text}</Text>
    </View>
  );
};
