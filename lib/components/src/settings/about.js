import React from 'react';
import styled from 'react-emotion';

import semver from 'semver';
import semverDiff from 'semver-diff';

import Logo from '../logo/logo';
import Alert from '../alert/alert';
import { Spaced } from '../grid/grid';

const ContentPanel = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  flex: 1,
  margin: `${theme.layoutMargin}px ${theme.layoutMargin}px ${theme.layoutMargin}px 0`,
  padding: theme.layoutMargin,
  border: theme.mainBorder,
  background: theme.mainFill,
  justifyContent: 'center',
  alignContent: 'center',
  display: 'flex',
}));

const Centered = styled('div')({
  margin: 'auto',
  textAlign: 'center',
});

const AlignedLogo = styled(Logo)({
  margin: 'auto',
});

const Version = ({ version, tag, notLatest }) => (
  <div>
    version {version}
    {tag && notLatest ? <span>({tag})</span> : null}
  </div>
);
const UpgradeNotice = ({ children, alt, level, current, next, tag, version }) => (
  <UpgradeNotice.Container>
    <UpgradeNotice.Intro>
      <Spaced>
        {alt ? (
          <div>
            <em>
              If something is blocking you from migrating to this upgrade above,
              <br />
              you could still upgrade to the highest {level} release:
            </em>
          </div>
        ) : null}
        <div>
          <span>⏫</span> Upgrade from {version} to the highest {level} ({tag}
          ): {next}
        </div>
      </Spaced>
    </UpgradeNotice.Intro>
    <UpgradeNotice.Command>
      <pre>
        <code>yarn upgrade-interactive --latest</code>
      </pre>
    </UpgradeNotice.Command>
  </UpgradeNotice.Container>
);
UpgradeNotice.Container = styled('div')(({ theme }) => ({
  borderRadius: theme.mainBorderRadius,
  overflow: 'hidden',
}));
UpgradeNotice.Intro = styled('div')(({ theme }) => ({
  padding: 20,
  position: 'relative',
  zIndex: 1,
  background: theme.mainFill,
  borderBottom: theme.mainBorder,
}));
UpgradeNotice.Command = styled('div')(({ theme }) => ({
  background: theme.asideFill,
  borderTop: theme.mainBorder,
  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2)',
  padding: 10,
  paddingTop: 20,
  marginTop: -10,
}));

const NonLatestNotice = ({ tag }) => (
  <Alert type="highlight" icon="🤞">
    You're using the {tag} release, read the release-notes carefully!
    <br />
    These releases may not adheare to semver, and may contain breaking changes.
  </Alert>
);

export default ({ version = '', tag = 'latest', releases = [] } = {}) => {
  const newReleases = releases.filter(r => r.tag === tag && semver.gt(r.version, version)).reduce(
    (acc, item) => {
      const level = semverDiff(version, item.version);

      if (level && (!acc[level] || semver.gt(item.version, acc[level].version))) {
        return { ...acc, [level]: item };
      }
      return acc;
    },
    {
      patch: null,
      minor: null,
      major: null,
    }
  );
  const notLatest = tag !== 'latest';

  return (
    <ContentPanel>
      <Centered>
        <Spaced row={2}>
          <div>
            <AlignedLogo colored />

            <Version {...{ version, tag, notLatest }} />
          </div>
          {newReleases.major ? (
            <UpgradeNotice level="major" {...{ version, tag, next: newReleases.major.version }} />
          ) : null}
          {newReleases.minor ? (
            <UpgradeNotice
              level="minor"
              {...{ version, tag, next: newReleases.minor.version }}
              alt={newReleases.major && newReleases.minor}
            />
          ) : null}
          {!newReleases.major && !newReleases.minor && newReleases.patch ? (
            <UpgradeNotice level="patch" {...{ version, tag, next: newReleases.patch.version }} />
          ) : null}

          {!newReleases.major && !newReleases.minor && !newReleases.patch ? (
            <Alert type="success">
              You're using the latest {tag && notLatest ? tag : ''} release!
            </Alert>
          ) : null}

          {notLatest ? <NonLatestNotice tag={tag} /> : null}
        </Spaced>
      </Centered>
    </ContentPanel>
  );
};
