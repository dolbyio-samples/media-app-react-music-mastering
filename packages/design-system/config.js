const {
  rootFormatter,
  fileHeaderFactory,
} = require('./src/utils/format.utils');
const {
  filterByCategoryFactory,
  filterByTypeFactory,
} = require('./src/utils/filter.utils');
const { TokenCategories, TokenTypes } = require('./src/utils/constants');

module.exports = {
  source: ['tokens/**/*.json'],
  format: {
    rootFormatter,
  },
  filter: {
    filterByTypeFactory,
  },
  platforms: {
    ts: {
      transformGroup: 'js',
      buildPath: 'build/web/',
      files: [
        {
          filter: filterByCategoryFactory(TokenCategories.Color),
          format: 'javascript/module',
          destination: `colors.js`,
          options: {
            outputReferences: true,
            showFileHeader: false,
          },
        },
        {
          filter: filterByCategoryFactory(TokenCategories.Color),
          format: 'typescript/module-declarations',
          destination: `colors.d.ts`,
          options: { showFileHeader: false },
        },
        {
          filter: filterByTypeFactory(TokenTypes.Gradient),
          format: 'javascript/module',
          destination: `gradients.js`,
          options: {
            outputReferences: true,
            showFileHeader: false,
          },
        },
        {
          filter: filterByTypeFactory(TokenTypes.Gradient),
          format: 'typescript/module-declarations',
          destination: `gradients.d.ts`,
          options: { showFileHeader: false },
        },
      ],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_colors.scss',
          format: 'rootFormatter',
          filter: filterByCategoryFactory(TokenCategories.Color),
          options: {
            fileHeader: fileHeaderFactory(TokenCategories.Color),
          },
        },
        {
          destination: '_gradients.scss',
          format: 'rootFormatter',
          filter: filterByTypeFactory(TokenTypes.Gradient),
          options: {
            fileHeader: fileHeaderFactory(
              TokenCategories.Color,
              TokenTypes.Gradient
            ),
          },
        },
      ],
    },
  },
};
