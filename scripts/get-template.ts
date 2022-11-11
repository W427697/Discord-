import { readdir } from 'fs/promises';
import { pathExists, readJSON } from 'fs-extra';
import { resolve } from 'path';
import { allTemplates, templatesByCadence } from '../code/lib/cli/src/repro-templates';

const sandboxDir = resolve(__dirname, '../sandbox');
const affectedJson = resolve(__dirname, '../affected.json');

export type Cadence = keyof typeof templatesByCadence;
export type Template = {
  cadence?: readonly Cadence[];
  skipTasks?: string[];
  expected?: {
    framework?: string;
    renderer?: string;
    builder?: string;
  };
  // there are other fields but we don't use them here
};
export type TemplateKey = keyof typeof allTemplates;
export type Templates = Record<TemplateKey, Template>;

async function getDirectories(source: string) {
  return (await readdir(source, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

// const getExistingSandboxes = async (): Promise<TemplateKey[]> => {
//   if (await pathExists(sandboxDir)) {
//     const sandboxes = await getDirectories(sandboxDir);
//     return sandboxes
//       .map((dirName) => {
//         return Object.keys(allTemplates).find(
//           (templateKey) => templateKey.replace('/', '-') === dirName
//         );
//       })
//       .filter(Boolean) as TemplateKey[];
//   }

//   return [];
// }

// export async function getTemplatesPerCadence(
//   cadence: Cadence
// ) {
//   let potentialTemplateKeys = await getExistingSandboxes();
//   let scripts = ['create', 'build', 'test-runner', 'chromatic', 'e2e']

//   if (potentialTemplateKeys.length === 0) {
//     const cadenceTemplates = Object.entries(allTemplates).filter(([key]) =>
//       templatesByCadence[cadence].includes(key as TemplateKey)
//     );
//     potentialTemplateKeys = cadenceTemplates.map(([k]) => k) as TemplateKey[];
//   }

//   potentialTemplateKeys = potentialTemplateKeys.filter(
//     (t) => !(allTemplates[t] as Template).skipTasks?.includes(scriptName)
//   );

//   if (await pathExists(affectedJson)) {
//     const affected = (await readJSON(affectedJson)).projects;
//     potentialTemplateKeys = potentialTemplateKeys.filter((t) => {
//       const template = allTemplates[t] as Template;
//       return (
//         affected.includes(template.expected.builder) ||
//         affected.includes(template.expected.renderer) ||
//         affected.includes(template.expected.framework)
//       );
//     });
//   }

//   console.log({ potentialTemplateKeys });

//   return potentialTemplateKeys;
// }

export async function getTemplate(
  cadence: Cadence,
  scriptName: string,
  { index, total }: { index: number; total: number }
) {
  let potentialTemplateKeys: TemplateKey[] = [];
  if (await pathExists(sandboxDir)) {
    const sandboxes = await getDirectories(sandboxDir);
    potentialTemplateKeys = sandboxes
      .map((dirName) => {
        return Object.keys(allTemplates).find(
          (templateKey) => templateKey.replace('/', '-') === dirName
        );
      })
      .filter(Boolean) as TemplateKey[];
  }

  if (potentialTemplateKeys.length === 0) {
    const cadenceTemplates = Object.entries(allTemplates).filter(([key]) =>
      templatesByCadence[cadence].includes(key as TemplateKey)
    );
    potentialTemplateKeys = cadenceTemplates.map(([k]) => k) as TemplateKey[];
  }

  potentialTemplateKeys = potentialTemplateKeys.filter(
    (t) => !(allTemplates[t] as Template).skipTasks?.includes(scriptName)
  );

  if (await pathExists(affectedJson)) {
    const affected = (await readJSON(affectedJson)).projects;
    potentialTemplateKeys = potentialTemplateKeys.filter((t) => {
      const template = allTemplates[t] as Template;
      return (
        affected.includes(template.expected.builder) ||
        affected.includes(template.expected.renderer) ||
        affected.includes(template.expected.framework)
      );
    });
  }

  console.log({ potentialTemplateKeys });

  // if (potentialTemplateKeys.length !== total) {
  //   throw new Error(`Circle parallelism set incorrectly.

  //     Parallelism is set to ${total}, but there are ${
  //     potentialTemplateKeys.length
  //   } templates to run:
  //     ${potentialTemplateKeys.join(', ')}
  //   `);
  // }

  return potentialTemplateKeys[index];
}

async function run() {
  const [, , cadence, scriptName] = process.argv;

  if (!cadence) throw new Error('Need to supply workflow to get template script');

  const { CIRCLE_NODE_INDEX = 0, CIRCLE_NODE_TOTAL = 1 } = process.env;

  console.log(
    await getTemplate(cadence as Cadence, scriptName, {
      index: +CIRCLE_NODE_INDEX,
      total: +CIRCLE_NODE_TOTAL,
    })
  );
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
