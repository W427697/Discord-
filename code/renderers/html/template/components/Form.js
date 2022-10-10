/* eslint-disable no-undef */
export const Form = ({ complete, value, setValue, onSubmit }) => {
  const container = document.createElement('div');

  container.innerHTML = `
    <form id="interaction-test-form" @submit.prevent="onSubmit">
      <label>
        Enter Value
        <input type="text" data-testid="value" required />
      </label>
      <button type="submit">Submit</button>
      ${complete ? '<p>Completed!!</p>' : ''}
    </form>
  `;

  const form = container.querySelector('form');
  form.onSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const input = container.querySelector('[data-testid="value"]');
  input.value = value;
  input.onInput = (e) => setValue(e.target.value);

  return container;
};
