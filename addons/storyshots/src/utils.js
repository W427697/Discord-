import path from 'path';
import sanitize from 'sanitize-filename';

export const snapshotPerStoryFile = {
  getSnapshotFileName(context) {
    const { fileName } = context;

    if (!fileName) {
      return null;
    }

    const { dir, name } = path.parse(fileName);
    return path.format({ dir: path.join(dir, '__snapshots__'), name, ext: '.storyshot' });
  },
  getPossibleStoriesFiles(storyshotFile) {
    const { dir, name } = path.parse(storyshotFile);

    return [
      path.format({ dir: path.dirname(dir), name, ext: '.js' }),
      path.format({ dir: path.dirname(dir), name, ext: '.jsx' }),
    ];
  }
};

export const snapshotPerStoryAdded = {
  getSnapshotFileName(context) {
    const { fileName, kind, story } = context;

    if (!fileName) {
      return null;
    }

    const { dir } = path.parse(fileName);
    const name = sanitize(`${kind}--${story}`)
    return path.format({ dir: path.join(dir, '__snapshots__'), name, ext: '.storyshot' });
  },
  getPossibleStoriesFiles(storyshotFile) {
    const { dir } = path.parse(storyshotFile);

    return [
      path.format({ dir: path.dirname(dir), name: 'stories', ext: '.js' }),
      path.format({ dir: path.dirname(dir), name: 'stories', ext: '.js' }),
      path.format({ dir: path.dirname(dir), name: '.stories', ext: '.jsx' }),
      path.format({ dir: path.dirname(dir), name: '.stories', ext: '.jsx' }),
    ];
  }
};
