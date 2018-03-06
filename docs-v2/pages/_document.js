import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { renderStatic } from 'glamor/server';

const css = `
.token.comment, .token.prolog, .token.doctype, .token.cdata {
  color: #5C6370;
}
.token.punctuation {
  color: #abb2bf;
}
.token.selector, .token.tag {
  color: #e06c75;
}
.token.property, .token.boolean, .token.number, .token.constant, .token.symbol, .token.attr-name, .token.deleted   {
  color: #d19a66;
}
.token.string, .token.char, .token.attr-value, .token.builtin, .token.inserted {
  color: #98c379;
}
.token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string   {
  color: #56b6c2;
}
.token.atrule, .token.keyword {
  color: #c678dd;
}
.token.function {
  color: #61afef;
}
.token.regex, .token.important, .token.variable {
  color: #c678dd;
}
.token.important, .token.bold {
  fontWeight: bold;
}
.token.italic {
  fontStyle: italic;
}
.token.entity {
  cursor: help;
}`;

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    const page = renderPage();
    const styles = renderStatic(() => page.html);
    return { ...page, ...styles };
  }

  constructor(props) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = this.props.ids;
    }
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <title>Storybook</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />

          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
          <style
            dangerouslySetInnerHTML={{
              __html: css,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
