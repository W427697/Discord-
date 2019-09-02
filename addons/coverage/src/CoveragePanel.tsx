import React from 'react';
import { useChannel, useAddonState } from '@storybook/api';
import { SyntaxHighlighter } from '@storybook/components';

import { CoverageSummary, CoverageDetail, ADDON_ID, EVENTS } from './shared';
import { lineCoverage } from './storyCoverage';

interface SummaryPanelProps {
  summary: CoverageSummary;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ summary }) => {
  return <div>{JSON.stringify(summary, null, 2)}</div>;
};

interface DetailPanelProps {
  detail: CoverageDetail;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ detail }) => {
  if (!(detail.source && detail.item)) {
    return <>No coverage</>;
  }

  const lineToMissing = lineCoverage(detail.item);
  const lineProps = (lineNumber: number) =>
    lineToMissing[lineNumber] ? { style: { backgroundColor: '#ffcccc' } } : {};
  return (
    <SyntaxHighlighter
      language="jsx"
      showLineNumbers
      wrapLines
      // @ts-ignore
      lineProps={lineProps}
      format={false}
      copyable={false}
      padded
    >
      {detail.source}
    </SyntaxHighlighter>
  );
};

export const CoveragePanel: React.FC<{}> = () => {
  const [coverageSummary, setCoverageSummary] = useAddonState<CoverageSummary>(ADDON_ID, null);
  const [coverageDetail, setCoverageDetail] = useAddonState<CoverageDetail>(ADDON_ID, null);
  useChannel({
    [EVENTS.COVERAGE_DETAIL]: (detail: CoverageDetail) => setCoverageDetail(detail),
  });
  // console.log('panel', { coverage });
  // return coverageSummary ? <SummaryPanel summary={coverageSummary} /> : <div>No coverage</div>;
  return coverageDetail ? <DetailPanel detail={coverageDetail} /> : <div>No coverage</div>;
};
