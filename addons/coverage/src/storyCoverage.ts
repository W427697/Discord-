import { CoverageMap, StoryMap, StoryCoverage, CoverageItem } from './shared';
import { StoriesHash } from '@storybook/api/dist/modules/stories';

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

export function compute(item: CoverageItem) {
  return computeSimpleTotals(item, 's', 'statementMap');
}

export function storyCoverage(coverageMap: CoverageMap, storyMap: StoryMap): StoryCoverage {
  const result: StoryCoverage = {};
  Object.entries(coverageMap).forEach(([fileName, item]) => {
    const key = stripExtension(fileName);
    const storyIds = storyMap[key];
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
