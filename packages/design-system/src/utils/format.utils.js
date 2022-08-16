const StyleDictionary = require('style-dictionary');
const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

const {
  AnnotationPresenters,
  TokenTypes,
  TokenCategories,
} = require('./constants');

/**
 * Constants
 */
const TokenCategoryConfig = {
  [TokenCategories.Color]: {
    label: 'Colors',
    presenter: AnnotationPresenters.Color,
    types: {
      [TokenTypes.Gradient]: {
        label: 'Gradients',
        presenter: AnnotationPresenters.Color,
      },
    },
  },
};

/**
 * Methods
 */
const rootFormatter = function ({ dictionary, file, options }) {
  const { outputReferences } = options;

  return (
    fileHeader({ file }) +
    ':root {\n' +
    formattedVariables({ format: 'sass', dictionary, outputReferences }) +
    '\n}\n'
  );
};

const getPropByToken = (tokenCategory, tokenType) => (prop) => {
  if (!tokenCategory || !prop) {
    return '';
  }
  return tokenType
    ? TokenCategoryConfig[tokenCategory].types[tokenType][prop]
    : TokenCategoryConfig[tokenCategory][prop];
};

const fileHeaderFactory =
  (tokenCategory, tokenType = '') =>
  (defaultMessage) => {
    if (!tokenCategory) {
      return [...defaultMessage];
    }
    const getProp = getPropByToken(tokenCategory, tokenType);
    const defaultLabel = getProp('label');
    const defaultPresenter = getProp('presenter');
    return [
      'This is a generated file. Do not edit directly.',
      `@tokens ${defaultLabel}`,
      `@presenter ${defaultPresenter}`,
    ];
  };

module.exports = {
  rootFormatter,
  fileHeaderFactory,
  TokenTypes,
  TokenCategories,
  AnnotationPresenters,
};
