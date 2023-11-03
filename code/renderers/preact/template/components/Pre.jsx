/**
 * Pre component
 * @param {object} props
 * @param {object} [props.style]
 * @param {object} [props.object]
 * @param {string} [props.text]
 */
export const Pre = ({ style = {}, object = null, text = '' }) => (
  <pre style={style} data-testid="pre">
    {object ? JSON.stringify(object, null, 2) : text}
  </pre>
);
