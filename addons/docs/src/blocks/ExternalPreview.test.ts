import { ExternalPreview } from './ExternalPreview';

const projectAnnotations = { render: jest.fn(), renderToDOM: jest.fn() };
const csfFileWithTitle = {
  default: { title: 'Component' },

  one: { args: { a: 'foo' } },
  two: { args: { b: 'bar' } },
};
const csfFileWithoutTitle = {
  default: {},

  one: { args: { a: 'foo' } },
};

describe('ExternalPreview', () => {
  describe('storyIdByModuleExport and storyById', () => {
    it('handles csf files with titles', async () => {
      const preview = new ExternalPreview(projectAnnotations);

      const storyId = preview.storyIdByModuleExport(csfFileWithTitle.one, csfFileWithTitle.default);
      const story = preview.storyById(storyId);

      expect(story).toMatchObject({
        title: 'Component',
        initialArgs: { a: 'foo' },
      });
    });

    it('returns consistent story ids and objects', () => {
      const preview = new ExternalPreview(projectAnnotations);

      const storyId = preview.storyIdByModuleExport(csfFileWithTitle.one, csfFileWithTitle.default);
      const story = preview.storyById(storyId);

      expect(preview.storyIdByModuleExport(csfFileWithTitle.one, csfFileWithTitle.default)).toEqual(
        storyId
      );
      expect(preview.storyById(storyId)).toBe(story);
    });

    it('handles more than one export', async () => {
      const preview = new ExternalPreview(projectAnnotations);

      preview.storyById(
        preview.storyIdByModuleExport(csfFileWithTitle.one, csfFileWithTitle.default)
      );

      const story = preview.storyById(
        preview.storyIdByModuleExport(csfFileWithTitle.two, csfFileWithTitle.default)
      );
      expect(story).toMatchObject({
        title: 'Component',
        initialArgs: { b: 'bar' },
      });
    });

    it('handles csf files without titles', async () => {
      const preview = new ExternalPreview(projectAnnotations);

      const storyId = preview.storyIdByModuleExport(
        csfFileWithoutTitle.one,
        csfFileWithoutTitle.default
      );
      const story = preview.storyById(storyId);

      expect(story).toMatchObject({
        title: expect.any(String),
        initialArgs: { a: 'foo' },
      });
    });
  });
});
