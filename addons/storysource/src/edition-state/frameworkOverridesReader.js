import { toId } from '@storybook/router';
import frameworks from './frameworks.json';

export function readFrameworkOverrides({ idsToFrameworks, story, kind }) {
  const framework = (idsToFrameworks || {})[toId(kind || 'a', story || 'a')] || '';
  return (
    frameworks[framework.substring('@storybook/'.length)] || {
      template: 'create-react-app',
      extraDependencies: ['react'],
      devDependencies: [],
    }
  );
}
