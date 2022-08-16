const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup');
const svgr = require('@svgr/rollup').default;
const commonjs = require('@rollup/plugin-commonjs');

module.exports = (config) => {
  const nxConfig = nrwlConfig(config);
  return {
    ...nxConfig,
    plugins: [commonjs(), svgr(), ...nxConfig.plugins],
  };
};
