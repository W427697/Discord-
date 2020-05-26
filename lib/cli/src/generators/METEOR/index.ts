import fs from 'fs';
import JSON5 from 'json5';
import baseGenerator, { Generator } from '../generator';
import { StoryFormat } from '../../project_types';

const generator: Generator = async (npmOptions, options) => {
  baseGenerator(npmOptions, options, 'react', {
    dirname: options.storyFormat === StoryFormat.MDX ? __dirname : undefined,
    extraPackages: ['react', 'react-dom', '@babel/preset-env', '@babel/preset-react'],
    staticDir: 'dist',
  });

  // create or update .babelrc
  let babelrc = null;
  if (fs.existsSync('.babelrc')) {
    const babelrcContent = fs.readFileSync('.babelrc', 'utf8');
    babelrc = JSON5.parse(babelrcContent);
    babelrc.plugins = babelrc.plugins || [];
  } else {
    babelrc = {
      presets: [
        ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' }],
        '@babel/preset-react',
      ],
    };
  }

  fs.writeFileSync('.babelrc', JSON.stringify(babelrc, null, 2), 'utf8');
};

export default generator;
