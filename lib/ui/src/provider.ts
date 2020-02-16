export default class Provider {
  getElements(type: string) {
    throw new Error('Provider.getElements() is not implemented!');
  }

  handleAPI(api: any) {
    throw new Error('Provider.handleAPI() is not implemented!');
  }

  getConfig() {
    console.error('Provider.getConfig() is not implemented!');

    return {};
  }
}
