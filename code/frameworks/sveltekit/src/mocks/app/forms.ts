export function enhance(form: HTMLFormElement) {
  // import('@storybook/addon-actions')
  //   .then(({ action }) => {
  //     action('sveltekit.enhance')();
  //   })
  //   .catch(console.log);
}

export function applyAction() {}

export function deserialize() {
  return deserializeResponse;
}

let deserializeResponse: any;

export function setDeserializeResponse(answer: any) {
  deserializeResponse = answer;
}
