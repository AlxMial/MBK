const rewireAliases = require("react-app-rewire-aliases");
const { paths } = require("react-app-rewired");
const path = require("path");

/* config-overrides.js */
module.exports = function override(config, env) {
  config = rewireAliases.aliasesOptions({
    "@services": path.resolve(__dirname, `${paths.appSrc}/services/`),
  })(config, env);
  return config;
};
