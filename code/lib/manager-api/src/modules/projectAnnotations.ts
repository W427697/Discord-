import { PROJECT_PREPARED } from '@storybook/core-events';
import type { API_ProjectAnnotations, ProjectPreparedPayload } from '@storybook/types';

import type { ModuleFn } from '../index';

// eslint-disable-next-line import/no-cycle
import { getEventMetadata } from '../lib/events';

export interface SubState {
  projectAnnotations?: API_ProjectAnnotations;
}

export interface SubAPI {
  getProjectAnnotations: () => API_ProjectAnnotations | null;
}

export const init: ModuleFn<SubAPI, SubState, true> = ({ store, fullAPI }) => {
  const api: SubAPI = {
    getProjectAnnotations() {
      return store.getState().projectAnnotations;
    },
  };

  const state: SubState = {};
  const initModule = () => {
    fullAPI.on(
      PROJECT_PREPARED,
      async function handleProjectPrepared({ argTypes, parameters }: ProjectPreparedPayload) {
        const { ref } = getEventMetadata(this, fullAPI);

        const projectAnnotations = { argTypes, parameters };
        if (!ref) {
          await store.setState({ projectAnnotations });
        } else {
          await fullAPI.updateRef(ref.id, { projectAnnotations });
        }
      }
    );
  };

  return {
    api,
    state,
    init: initModule,
  };
};
