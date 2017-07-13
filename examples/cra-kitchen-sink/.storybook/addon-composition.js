import React from 'react';

function addX(story, context, options) {
  console.log(options);
  return story(context);
}

export default {
  getAddons(...addons) {
    console.log(addons);
    this._add = this.add;

    this.add = (name, storyFn) => {

      const apiFn = (context) => {
        let writtingStory = null;

        const apiContext = {
          ...context,
          cleanStory: null,
        };

        apiContext.storyOf = (component) => {
          if (typeof addonFn === 'function') {
            writtingStory = component(cleanStory);
          } else {
            writtingStory = component;
          }
          apiContext.cleanStory = writtingStory;
          return apiContext;
        };
        //   withX(...props) {
        //     writtingStory = addX(() => writtingStory, context, ...props);
        //     return apiContext;
        //   }
        // };

        addons.forEach((addonFn, ind) => {
          if (typeof addonFn === 'function') {
            const name = addonFn.name || `with${ind}`;
            apiContext[name] = (...props) => {
              writtingStory = addonFn(() => writtingStory, context, ...props);
              // apiContext.cleanStory
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
