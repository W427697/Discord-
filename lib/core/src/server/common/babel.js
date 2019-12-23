function createProdPresets() {
  return [
    [
      require.resolve('babel-preset-minify'),
      {
        builtIns: false,
        mangle: false,
      },
    ],
  ];
}

export default ({ configType }) => {
  const isProd = configType === 'PRODUCTION';
  const prodPresets = isProd ? createProdPresets() : [];

  return {
    sourceType: 'unambiguous',
    presets: [...prodPresets],
    plugins: [
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          absoluteRuntime: false,
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: false,
        },
      ],

      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      require.resolve('@babel/plugin-proposal-class-properties'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      [require.resolve('babel-plugin-emotion'), { sourceMap: true, autoLabel: true }],
      require.resolve('babel-plugin-macros'),
    ],
  };
};
