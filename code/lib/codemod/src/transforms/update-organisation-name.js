export const packageNames = {
  '@kadira/react-storybook-decorator-centered': '@junk-temporary-prototypes/addon-centered',
  '@kadira/storybook-addons': '@junk-temporary-prototypes/preview-api',
  '@kadira/storybook-addon-actions': '@junk-temporary-prototypes/addon-actions',
  '@kadira/storybook-addon-comments': '@junk-temporary-prototypes/addon-comments',
  '@kadira/storybook-addon-graphql': '@junk-temporary-prototypes/addon-graphql',
  '@kadira/storybook-addon-info': '@junk-temporary-prototypes/addon-info',
  '@kadira/storybook-addon-knobs': '@junk-temporary-prototypes/addon-knobs',
  '@kadira/storybook-addon-links': '@junk-temporary-prototypes/addon-links',
  '@kadira/storybook-addon-notes': '@junk-temporary-prototypes/addon-notes',
  '@kadira/storybook-addon-options': '@junk-temporary-prototypes/addon-options',
  '@kadira/storybook-channels': '@junk-temporary-prototypes/channels',
  '@kadira/storybook-channel-postmsg': '@junk-temporary-prototypes/channel-postmessage',
  '@kadira/storybook-channel-websocket': '@junk-temporary-prototypes/channel-websocket',
  '@kadira/storybook-ui': '@junk-temporary-prototypes/manager',
  '@kadira/react-native-storybook': '@junk-temporary-prototypes/react-native',
  '@kadira/react-storybook': '@junk-temporary-prototypes/react',
  '@kadira/getstorybook': '@junk-temporary-prototypes/cli',
  '@kadira/storybook': '@junk-temporary-prototypes/react',
  storyshots: '@junk-temporary-prototypes/addon-storyshots',
  getstorybook: '@junk-temporary-prototypes/cli',
};

export default function transformer(file, api) {
  const j = api.jscodeshift;

  const packageNamesKeys = Object.keys(packageNames);

  /**
   * Checks whether the node value matches a Storybook package
   * @param {string} the import declaration node
   * @returns {string} whether the node value matches a Storybook package
   */
  const getMatch = (oldpart) => packageNamesKeys.find((newpart) => oldpart.match(newpart));

  /**
   * Returns the name of the Storybook packages with the organisation name,
   * replacing the old `@kadira/` prefix.
   * @param {string} oldPackageName the name of the old package
   * @return {string} the new package name
   * @example
   * // returns '@junk-temporary-prototypes/storybook'
   * getNewPackageName('@kadira/storybook')
   */
  const getNewPackageName = (oldPackageName) => {
    const match = getMatch(oldPackageName);

    if (match) {
      const replacement = packageNames[match];
      return oldPackageName.replace(match, replacement);
    }
    return oldPackageName;
  };

  /**
   * updatePackageName - updates the source name of the Storybook packages
   * @param {ImportDeclaration} declaration the import declaration
   * @returns {ImportDeclaration.Node} the import declaration node
   */
  const updatePackageName = (declaration) => {
    // eslint-disable-next-line no-param-reassign
    declaration.node.source.value = getNewPackageName(declaration.node.source.value);

    return declaration.node;
  };

  return j(file.source)
    .find(j.ImportDeclaration)
    .replaceWith(updatePackageName)
    .toSource({ quote: 'single' });
}
