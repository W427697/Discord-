const initialState = [
  {
    name: 'Welcome',
    children: [
      {
        name: 'Story 1',
      },
      {
        name: 'Group1',
        children: [
          {
            name: 'Sub Story 1',
          },
        ],
      },
    ],
  },
];

const LOAD_STORIES = '@storybook/ui/LOAD_STORIES';

const parseNode = (acc, parts) => {
  if (parts.length === 1) {
    acc.push({ name: parts[0], children: [] });
  } else {
    const foundIndex = acc.findIndex(g => g.name === parts[0]);
    if (foundIndex >= 0) {
      acc[foundIndex].children = parseNode(acc[foundIndex].children, parts.slice(1));
    } else {
      acc.push({
        name: parts[0],
        children: parseNode([], parts.slice(1)),
      });
    }
  }
  return acc;
};

const storiesReducer = (state = initialState, action) => {
  switch (action.type) {
    // case LOAD_STORIES: {
    //   return action.stories.reduce((acc, storyPath) => {
    //     const parts = storyPath.split('/');
    //     return parseNode(acc, parts);
    //   }, []);
    // }
    default:
      return state;
  }
};

export default storiesReducer;
