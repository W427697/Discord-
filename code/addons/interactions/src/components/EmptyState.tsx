import React, { useEffect, useState } from 'react';
import { Link, EmptyTabContent } from '@storybook/components';
import { DocumentIcon, VideoIcon } from '@storybook/icons';
import { useStorybookApi } from '@storybook/manager-api';
import { styled } from '@storybook/core/dist/theming';

import { DOCUMENTATION_LINK, TUTORIAL_VIDEO_LINK } from '../constants';

const Links = styled.div(({ theme }) => ({
  display: 'flex',
  fontSize: theme.typography.size.s2 - 1,
  gap: 25,
}));

const Divider = styled.div(({ theme }) => ({
  width: 1,
  height: 16,
  backgroundColor: theme.appBorderColor,
}));

export const Empty = () => {
  const [isLoading, setIsLoading] = useState(true);
  const api = useStorybookApi();
  const docsUrl = api.getDocsUrl({
    subpath: DOCUMENTATION_LINK,
    versioned: true,
    renderer: true,
  });

  // We are adding a small delay to avoid flickering when the story is loading.
  // It takes a bit of time for the controls to appear, so we don't want
  // to show the empty state for a split second.
  useEffect(() => {
    const load = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(load);
  }, []);

  if (isLoading) return null;

  return (
    <EmptyTabContent
      title="Interaction testing"
      description={
        <>
          Interaction tests allow you to verify the functional aspects of UIs. Write a play function
          for your story and you&apos;ll see it run here.
        </>
      }
      footer={
        <Links>
          <Link href={TUTORIAL_VIDEO_LINK} target="_blank" withArrow>
            <VideoIcon /> Watch 8m video
          </Link>
          <Divider />
          <Link href={docsUrl} target="_blank" withArrow>
            <DocumentIcon /> Read docs
          </Link>
        </Links>
      }
    />
  );
};
