module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    // Reanimated v4 moved the Babel plugin to react-native-worklets
    // It must remain the last plugin in this list
    plugins: [
      'react-native-worklets/plugin',
    ],
  };
};
