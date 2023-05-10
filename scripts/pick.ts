/* eslint-disable no-await-in-loop */
import program from 'commander';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import { graphql } from '@octokit/graphql';
import type { GraphQlQueryResponseData } from '@octokit/graphql';
import { prompt } from 'prompts';

import { exec } from './utils/exec';

const logger = console;

const OWNER = 'storybookjs';
const REPO = 'storybook';
const SOURCE_BRANCH = 'next';

if (!process.env.GH_TOKEN) {
  logger.error('GH_TOKEN environment variable must be set, exiting.');
  process.exit(1);
}

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GH_TOKEN}`,
  },
});

interface PR {
  number: number;
  id: string;
  branch: string;
  title: string;
  mergeCommit: string;
}

const LABEL = {
  PATCH: 'patch',
  PICKED: 'picked',
  DOCUMENTATION: 'documentation',
};

async function getUnpickedPRs(
  sourceBranch: string,
  documentationOnly: boolean
): Promise<Array<PR>> {
  const result = await graphqlWithAuth<GraphQlQueryResponseData>(
    `
      query ($owner: String!, $repo: String!, $state: PullRequestState!, $order: IssueOrder!) {
        repository(owner: $owner, name: $repo) {
          pullRequests(states: [$state], labels: ["patch"], orderBy: $order, first: 50) {
            nodes {
              id
              number
              title
              baseRefName
              mergeCommit { 
                abbreviatedOid
              }
              labels(first: 20) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
    `,
    {
      owner: OWNER,
      repo: REPO,
      order: {
        field: 'UPDATED_AT',
        direction: 'DESC',
      },
      state: 'MERGED',
    }
  );

  const {
    pullRequests: { nodes },
  } = result.repository;

  const prs = nodes.map((node: any) => ({
    number: node.number,
    id: node.id,
    branch: node.baseRefName,
    title: node.title,
    mergeCommit: node.mergeCommit.abbreviatedOid,
    labels: node.labels.nodes.map((l: any) => l.name),
  }));

  const unpickedPRs = prs.filter((pr: any) => !pr.labels.includes(LABEL.PICKED));
  // logger.log('Unpicked PRs', unpickedPRs.length);
  const labeledPRs = documentationOnly
    ? unpickedPRs.filter((pr: any) => pr.labels.includes(LABEL.DOCUMENTATION))
    : unpickedPRs;
  // logger.log('Filtered PRs', labeledPRs.length);
  const branchPRs = labeledPRs.filter((pr: any) => pr.branch === sourceBranch);
  // logger.log('Branch PRs', branchPRs.length);

  // PRs in forward chronological order
  return branchPRs.reverse();
}

function formatPR(pr: PR): string {
  return `https://github.com/${OWNER}/${REPO}/pull/${pr.number} ${chalk.yellow(pr.mergeCommit)}
  "${pr.title}"`;
}

async function getLabelIds(labelNames: string[]) {
  const query = labelNames.join('+');
  const result = await graphqlWithAuth<GraphQlQueryResponseData>(
    `
      query ($owner: String!, $repo: String!, $q: String!) {
        repository(owner: $owner, name: $repo) {
          labels(query: $q, first: 10) {
            nodes {
              id
              name
              description
            }
          }
        }
      }
    `,
    {
      owner: OWNER,
      repo: REPO,
      q: query,
    }
  );

  const { labels } = result.repository;
  const labelToId = {} as Record<string, string>;
  labels.nodes.forEach((label: { name: string; id: string }) => {
    labelToId[label.name] = label.id;
  });
  return labelToId;
}

async function labelPR(id: string, labelToId: Record<string, string>) {
  logger.log('labeling', id);
  const result = await graphqlWithAuth(
    `
      mutation ($input: AddLabelsToLabelableInput!) {
        addLabelsToLabelable(input: $input) {
          clientMutationId
        }
      }
    `,
    {
      input: {
        labelIds: [labelToId[LABEL.PICKED]],
        labelableId: id,
        clientMutationId: uuidv4(),
      },
    }
  );

  logger.log(JSON.stringify(result));
}

async function pickPR(pr: PR) {
  logger.log(`Picking ${formatPR(pr)}`);
  await exec(`git cherry-pick -m1 ${pr.mergeCommit}`);
}

async function confirm({ sourceBranch, patchPRs, documentationOnly }: any): Promise<boolean> {
  const what = documentationOnly
    ? `${patchPRs.length} documentation-only`
    : `ALL ${patchPRs.length}`;

  const { ok } = await prompt.prompt([
    {
      type: 'confirm',
      message: `Picking ${chalk.bold(chalk.green(what))} PRs from ${chalk.yellow(
        sourceBranch
      )}. ${chalk.cyan('Continue?')}`,
      name: 'ok',
    },
  ]);
  return ok;
}

interface PickOptions {
  documentation?: boolean;
}

export const pick = async (options: PickOptions = {}) => {
  const documentationOnly = !!options.documentation;
  const sourceBranch = SOURCE_BRANCH;
  const labelToId = await getLabelIds(Object.values(LABEL));
  const patchPRs = await getUnpickedPRs(sourceBranch, documentationOnly);

  patchPRs.forEach((pr) => logger.log(formatPR(pr)));

  if (patchPRs.length === 0 || !(await confirm({ sourceBranch, patchPRs, documentationOnly }))) {
    return;
  }

  const results = [];
  for (let i = 0; i < patchPRs.length; i += 1) {
    const pr = patchPRs[i];
    try {
      await pickPR(pr);
      await labelPR(pr.id, labelToId);
      results.push({ ok: true, pr });
    } catch (err) {
      logger.log(chalk.red('aborting'), err);
      await exec('git cherry-pick --abort');
      results.push({ ok: false, pr });
    }
  }
  results.forEach(({ ok, pr }) => {
    const status = ok ? chalk.green('OK') : chalk.red('FAIL');
    logger.log(`${status} ${formatPR(pr)}`);
  });
};

program.option('--documentation', 'Only pick documentation PRs');
const options = program.parse(process.argv) as PickOptions;
pick(options).then(() => logger.log('✨ done'));
