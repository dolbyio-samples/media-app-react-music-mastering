const { TokenTypes } = require('./constants');

const filterByCategoryFactory = (filterCategory) => (token) => {
  if (!filterCategory) {
    return false;
  }
  const {
    attributes: { category: tokenCategory, type: tokenType },
  } = token;
  return tokenCategory === filterCategory && tokenType === TokenTypes.Base;
};

const filterByTypeFactory = (filterType) => (token) => {
  const {
    attributes: { type: tokenType },
  } = token;
  return filterType === tokenType;
};

module.exports = {
  filterByCategoryFactory,
  filterByTypeFactory,
};
