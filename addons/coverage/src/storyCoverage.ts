import { window } from 'global';
import { CoverageMap, StoryMap, CoverageSummary, CoverageItem, EVENTS } from './shared';
import addons, { StoryFn, StoryContext, Parameters } from '@storybook/addons';

export function stripExtension(filePath: string) {
  const stripped = filePath.replace(/\.[tj]sx?$/, '');
  return stripped.replace(/\.stories$/, '');
}

function percent(covered: number, total: number) {
  if (total > 0) {
    const tmp = (1000 * 100 * covered) / total + 5;
    return Math.floor(tmp / 10) / 100;
  } else {
    return 100.0;
  }
}

function computeSimpleTotals(fileCoverage: any, property: any, mapProperty: any): number {
  var stats = fileCoverage[property],
    map = mapProperty ? fileCoverage[mapProperty] : null,
    ret = { total: 0, covered: 0, skipped: 0 };

  Object.keys(stats).forEach(function(key) {
    var covered = !!stats[key],
      skipped = map && map[key].skip;
    ret.total += 1;
    if (covered || skipped) {
      ret.covered += 1;
    }
    if (!covered && skipped) {
      ret.skipped += 1;
    }
  });
  return percent(ret.covered, ret.total);
}

export function lineCoverage(item: CoverageItem) {
  const lineToMissing: Record<number, boolean> = {};
  Object.entries(item.s).forEach(([statementId, isCovered]) => {
    const stmt = item.statementMap[statementId];
    if (!isCovered) {
      for (let i: number = stmt.start.line; i <= stmt.end.line; i += 1) {
        lineToMissing[i] = true;
      }
    }
  });
  return lineToMissing;
}

export function compute(item: CoverageItem) {
  return computeSimpleTotals(item, 's', 'statementMap');
}

export function coverageSummary(coverageMap: CoverageMap, storyMap: StoryMap): CoverageSummary {
  const result: CoverageSummary = {};
  Object.entries(coverageMap).forEach(([filename, item]) => {
    // const key = stripExtension(fileName);
    const storyIds = storyMap[filename];
    if (storyIds) {
      const coverage = compute(item);
      storyIds.forEach(storyId => {
        result[storyId] = coverage;
      });
    }
  });
  // FIXME: should we leave these as undefined?
  // Object.values(storyMap).forEach(storyIds => {
  //   storyIds.forEach(storyId => {
  //     if (!(storyId in result)) {
  //       result[storyId] = 0;
  //     }
  //   });
  // });
  return result;
}

const getSource = (parameters: Parameters): Parameters => {
  const { filename = null, source = null } =
    // eslint-disable-next-line no-underscore-dangle
    (parameters && parameters.component && parameters.component.__docgenInfo) || {};
  return { filename, source };
};

export function storyMap(storyStore: any): StoryMap {
  const storyMap: StoryMap = {};
  storyStore.raw().forEach(({ id, parameters }: { id: string; parameters: Parameters }) => {
    const { filename } = getSource(parameters);
    if (filename) {
      let ids = storyMap[filename];
      if (!ids) {
        ids = [];
        storyMap[filename] = ids;
      }
      ids.push(id);
    }
  });
  return storyMap;
}

export const coverageDetail = (context: StoryContext) => {
  const coverageMap: CoverageMap = window.__STORYBOOK_COVERAGE_MAP__;
  const { filename, source } = getSource(context.parameters);
  const item = coverageMap && filename && coverageMap[filename];
  return {
    source,
    filename,
    item,
  };
};

export const withCoverage = (getStory: StoryFn, context: StoryContext) => {
  addons.getChannel().emit(EVENTS.COVERAGE_DETAIL, coverageDetail(context));
  return getStory(context);
};
