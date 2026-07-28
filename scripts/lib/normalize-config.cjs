function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function merge(base, overrides) {
  var result = Object.assign({}, base);

  if (!isObject(overrides)) {
    return result;
  }

  Object.keys(overrides).forEach(function (key) {
    if (isObject(result[key]) && isObject(overrides[key])) {
      result[key] = merge(result[key], overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  });

  return result;
}

function normalizeThemeConfig(defaults, overrides, siteConfig) {
  var config = merge(defaults, overrides);

  if (config.rss === "" && siteConfig.feed && siteConfig.feed.path) {
    config.rss = siteConfig.feed.path;
  }

  return config;
}

module.exports = { normalizeThemeConfig: normalizeThemeConfig };
