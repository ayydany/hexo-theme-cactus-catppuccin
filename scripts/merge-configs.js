/**
* Merge all `theme_config.*` options from main Hexo config into hexo.theme.config.
* This fixes an issue with hexo-renderer-stylus, which otherwise ignores these
* configuration overrides.
*/
const { normalizeThemeConfig } = require("./lib/normalize-config.cjs");

hexo.on('generateBefore', function () {
  hexo.theme.config = normalizeThemeConfig(
    hexo.theme.config,
    hexo.config.theme_config,
    hexo.config
  );
});
