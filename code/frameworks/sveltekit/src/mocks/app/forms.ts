export function enhance(form: HTMLFormElement) {
  const event = new CustomEvent('storybook:enhance');
  window.dispatchEvent(event);
}

export function applyAction() {}

export function deserialize() {
  return deserializeResponse;
}

let deserializeResponse: any;

export function setDeserializeResponse(answer: any) {
  deserializeResponse = answer;
}
