import { configure, setAddon } from '@storybook/react';
import { withInfo, setInfoOptions } from '@storybook/addon-info';
import { setOptions } from '@storybook/addon-options';

setOptions({
  downPanelInRight: true,
})

setAddon({
  summary(info) {
    return this.addDecorator(story => {
      setInfoOptions(info);
      return story();
    })
  }
});

function loadStories() {
  require('../src/components/stories');
}

configure(loadStories, module);
