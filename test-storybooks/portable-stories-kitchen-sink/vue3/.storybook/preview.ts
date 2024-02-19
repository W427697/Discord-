import type { Preview } from '@storybook/vue3';

console.log('preview file is called!');

const preview: Preview = {
  // TODO: figure out decorators
  // decorators: [
  //   () => ({ 
  //     template: `
  //       <div data-decorator>
  //         Decorator
  //         <br />
  //         <story />
  //       </div>
  //     `
  //   })
  // ],
};

export default preview;
