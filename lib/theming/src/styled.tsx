import React, { ElementType } from 'react';
import emotionStyled, { StyledOptions } from '@emotion/styled';
import { Context } from './context';

const storybookStyled = (tag: any, options?: StyledOptions) => {
  const createStyled = emotionStyled(tag, options);

  return (...args: any[]) => {
    const PrevStyled = createStyled(...args);

    const NewStyled: any = React.forwardRef((props, ref) => (
      <Context.Consumer>
        {(theme) => <PrevStyled ref={ref} {...props} theme={theme} />}
      </Context.Consumer>
    ));

    NewStyled.withComponent = (nextTag: ElementType, nextOptions?: StyledOptions) => {
      return storybookStyled(
        nextTag,
        nextOptions !== undefined ? { ...(options || {}), ...nextOptions } : options
        // eslint-disable-next-line no-underscore-dangle
      )(...PrevStyled.__emotion_styles);
    };

    return NewStyled;
  };
};

const newStyled = storybookStyled.bind(this);

Object.keys(emotionStyled).forEach((tagName) => {
  newStyled[tagName] = newStyled(tagName);
});

export const styled = newStyled;
