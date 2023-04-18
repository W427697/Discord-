import path from 'path';
import { execSync } from 'child_process';
import { getProjectRoot } from '@storybook/core-common';

import { oneWayHash } from './one-way-hash';

export function normalizeGitUrl(rawUrl: string) {
  // I don't *think* its possible to set a hash on a origin URL, but just in case
  const urlWithoutHash = rawUrl.trim().replace(/#.*$/, '');

  // Strip anything ahead of an @
  const urlWithoutUser = urlWithoutHash.replace(/^.*@/, '');

  // Now strip off scheme
  const urlWithoutScheme = urlWithoutUser.replace(/^.*\/\//, '');
  console.warn({ rawUrl, urlWithoutHash, urlWithoutUser, urlWithoutScheme })

  return urlWithoutScheme.replace(':', '/');
}

let anonymousProjectId: string;
export const getAnonymousProjectId = () => {
  console.warn({ anonymousProjectId });
  if (anonymousProjectId) {
    return anonymousProjectId;
  }

  let unhashedProjectId;
  try {
    const projectRoot = getProjectRoot();

    const projectRootPath = path.relative(projectRoot, process.cwd());
    console.warn({ projectRoot, projectRootPath, cwd: process.cwd() });

    const originBuffer = execSync(`git config --local --get remote.origin.url`, {
      timeout: 1000,
      stdio: `pipe`,
    });

    // we use a combination of remoteUrl and working directory
    // to separate multiple storybooks from the same project (e.g. monorepo)
    unhashedProjectId = `${normalizeGitUrl(String(originBuffer))}${projectRootPath}`;

    console.warn({unhashedProjectId});

    anonymousProjectId = oneWayHash(unhashedProjectId);
    console.warn({anonymousProjectId});
  } catch (_) {
    //
  }

  return anonymousProjectId;
};
