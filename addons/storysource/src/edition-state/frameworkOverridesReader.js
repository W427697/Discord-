import { toId } from '@storybook/router';
import frameworks from './frameworks.json';

export function getFrameworkName({ idsToFrameworks, story, kind }) {
  return (idsToFrameworks || {})[toId(kind || 'a', story || 'a')] || '';
}

export function readFrameworkOverrides({ idsToFrameworks, story, kind }) {
  const framework = getFrameworkName({ idsToFrameworks, story, kind });
  return (
    frameworks[framework.substring('@storybook/'.length)] || {
      template: 'create-react-app',
      extraDependencies: ['react'],
      devDependencies: [],
    }
  );
}
