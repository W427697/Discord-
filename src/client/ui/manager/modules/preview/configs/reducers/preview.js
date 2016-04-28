import { types } from '../../actions';

export default function (state, action) {
  switch (action.type) {
    case types.SELECT_STORY: {
      // TODO: if action.story is null, we need to select the first story of the
      // given kind.
      return {
        ...state,
        selectedKind: action.kind,
        selectedStory: action.story,
      };
    }

    case types.CLEAR_ACTIONS: {
      return {
        ...state,
        actions: [],
      };
    }

    case types.SET_STORIES: {
      // TODO: reset selected story by checking whether we've the selected
      // story or not.
      return {
        ...state,
        stories: action.stories,
      };
    }

    case types.ADD_ACTION: {
      const actions = [
        action.action,
        ...state.actions || [],
      ].slice(0, 10);

      return {
        ...state,
        actions,
      };
    }

    default:
      return state;
  }
}
