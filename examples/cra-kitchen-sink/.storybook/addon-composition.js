import React from 'react';

export default {
  getAddons(...addons) {
    this._add = this.add;

    this.add = (name, storyFn) => {

      const apiFn = (context) => {
        let writtingStory = null;

        const apiContext = {
          ...context,
          cleanStory: null,
        };

        apiContext.storyOf = (component) => {
          if (typeof component === 'function') {
            writtingStory = component(apiContext.cleanStory);
          } else {
            writtingStory = component;
          }
          apiContext.cleanStory = writtingStory;
          return apiContext;
        };

        addons.forEach((addonFn, ind) => {
          if (typeof addonFn === 'function') {
            const name = addonFn.name || `with${ind}`;
            apiContext[name] = (...props) => {
              writtingStory = addonFn(() => writtingStory, context, ...props);
              return apiContext;
            }
          }
        });

        const result = storyFn(apiContext);
        if (result === apiContext) {
          return  writtingStory;
        } else {
          return result;
        }
      };
      return this._add(name, apiFn)
    }
  }
};
