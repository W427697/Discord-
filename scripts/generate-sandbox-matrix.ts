import {
  templatesByCadence,
  allTemplates,
  skippableTasks,
} from '../code/lib/cli/src/sandbox-templates';
import { type Cadence, type SkippableTask } from '../code/lib/cli/src/sandbox-templates';

type TemplateKey = keyof typeof allTemplates;

async function run() {
  const [, , labels, isDraft] = process.argv;

  const cadenceLabels = (JSON.parse(labels) as string[])
    .filter((label) => label.startsWith('ci:'))
    .map((label) => label.split(':')[1]);

  let cadence = (['daily', 'merged', 'pr'] as Cadence[]).find((sortedCadence) =>
    cadenceLabels.includes(sortedCadence)
  );
  if (!cadence) {
    cadence = isDraft === 'true' ? 'ci' : 'pr';
  }

  const templatesToRun = Object.entries(allTemplates).filter(([templateKey, { inDevelopment }]) => {
    return templatesByCadence[cadence].includes(templateKey as TemplateKey) && !inDevelopment;
  });

  const matrixFormat = templatesToRun.map(([templateKey, template]) => {
    const tasks: Record<string, boolean> = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const skippableTask of skippableTasks) {
      tasks[skippableTask] = !template.skipTasks?.includes(skippableTask as SkippableTask);
    }
    return {
      template: templateKey,
      ...tasks,
    };
  });
  console.log(JSON.stringify({ include: matrixFormat }));
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
