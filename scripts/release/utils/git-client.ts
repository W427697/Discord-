import { simpleGit } from 'simple-git';

export const git = simpleGit({
  config: [
    /**
     * ensures that prereleases are listed as earlier than stable releases.
     * eg. in the following list, this config correctly puts 7.1.0 on the top instead of the bottom:
     * 7.1.0
     * 7.1.0-rc.2
     * 7.1.0-rc.1
     * See https://stackoverflow.com/a/52680984
     */
    'versionsort.suffix=-',
  ],
});

export async function getLatestTag() {
  return (await git.tags(['v*', '--sort=-v:refname', '--merged'])).latest;
}
