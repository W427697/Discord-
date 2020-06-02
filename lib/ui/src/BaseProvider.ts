import { Types, Collection } from '@storybook/addons';

export default class Provider {
  getElements(type: Types): Collection {
    console.error('Provider.getElements() is not implemented!');
    return {} as Collection;
  }

  handleAPI(api: any) {
    console.error('Provider.handleAPI() is not implemented!');
  }

  getConfig() {
    console.error('Provider.getConfig() is not implemented!');

    return {};
  }
}
