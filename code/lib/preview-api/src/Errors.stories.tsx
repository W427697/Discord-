import React from 'react';
import AnsiToHtml from 'ansi-to-html';

const ansiConverter = new AnsiToHtml({
  escapeXML: true,
});

const Component = ({ id, header, detail }: any) => {
  const element = document.querySelector('.' + id);
  if (!element) {
    throw new Error('Element not found');
  }

  if (header) {
    document.getElementById('error-message')!.innerHTML = ansiConverter.toHtml(header);
  }

  if (detail) {
    document.getElementById('error-stack')!.innerHTML = ansiConverter.toHtml(detail);
  }

  // remove the ids, otherwise chromatic will assume the story failed to render
  const content = element.outerHTML.replace('error-message', '').replace('error-stack', '');

  // remove the content, otherwise chromatic will assume the story failed to render
  document.getElementById('error-message')!.innerHTML = '';
  document.getElementById('error-stack')!.innerHTML = '';

  return (
    <div
      className="sb-show-nopreview sb-show-errordisplay"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default {
  component: Component,
  parameters: {
    layout: 'fullscreen',
    theme: 'light',
  },
  title: 'Errors',
  args: {
    id: 'sb-errordisplay',
  },
};

export const MyError = {
  args: {
    header: new Error('ow no, something went wrong').message,
    detail: new Error('ow no, something went wrong').stack,
  },
};

export const Missing = {
  args: {
    id: 'sb-nopreview',
  },
};
