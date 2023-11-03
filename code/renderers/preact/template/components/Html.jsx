/**
 * HTML
 * @param {object} props
 * @param {string} props.content
 */
export const Html = ({ content }) => <div dangerouslySetInnerHTML={{ __html: content }} />;
