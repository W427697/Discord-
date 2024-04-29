import React from 'react';
import AnsiToHtml from 'ansi-to-html';

const ansiConverter = new AnsiToHtml({
  escapeXML: true,
});

const Component = ({ id, header, detail }: any) => {
  const element = document.querySelector('.' + id);
  if (!element) {
    return <div>Element not found</div>;
  }

  if (header) {
    document.getElementById('error-message')!.innerHTML = ansiConverter.toHtml(header);
  }

  if (detail) {
    document.getElementById('error-stack')!.innerHTML = ansiConverter.toHtml(detail);
  }

  const content = element.outerHTML;

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
