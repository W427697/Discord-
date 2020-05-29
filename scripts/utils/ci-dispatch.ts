const logger = console;

/**
 * Assign jobs based on circle ci nodes
 * @param array of actions that can be launched in //
 */
export const dispatch = <T extends any>(array: T[], getName?: (job: T) => string) => {
  const nodeIndex = +process.env.CIRCLE_NODE_INDEX || 0;
  const numberOfNodes = +process.env.CIRCLE_NODE_TOTAL || 1;

  const list = array.filter((_, index) => {
    return index % numberOfNodes === nodeIndex;
  });
  const names = getName ? `jobs ${list.map(getName).join(' ,')}` : `${list.length} jobs`;
  logger.info(`📑 Assigning ${names} to node ${nodeIndex} (on ${numberOfNodes})`);
  return list;
};
