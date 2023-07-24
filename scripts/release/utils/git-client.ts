import { simpleGit } from 'simple-git';

export const git = simpleGit();

export async function getLatestTag() {
  /**
   * ensures that prereleases are listed as earlier than stable releases.
   * eg. in the following list, 7.1.0 would correctly be considered the latest:
   * 7.1.0
   * 7.1.0-rc.2
   * 7.1.0-rc.1
   * See https://stackoverflow.com/a/52680984
   */
  const gitWithSort = simpleGit({ config: ['versionsort.suffix=-'] });
  return (await gitWithSort.tags(['v*', '--sort=-v:refname', '--merged'])).latest;
}
