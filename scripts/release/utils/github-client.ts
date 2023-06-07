import { graphql } from '@octokit/graphql';

export const githubGraphQlClient = graphql.defaults({
  headers: { authorization: `token ${process.env.GH_TOKEN}` },
});
