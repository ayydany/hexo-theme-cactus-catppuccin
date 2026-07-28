function resolveUrl(setting, size, options) {
  var gravatar = options.theme.gravatar;

  if (setting.gravatar && gravatar && (gravatar.email || gravatar.hash)) {
    return gravatar.email
      ? options.gravatar(gravatar.email, size)
      : "https://www.gravatar.com/avatar/" + gravatar.hash + "?s=" + size;
  }

  return options.urlFor(setting.url);
}

function buildFaviconViewModel(options) {
  var favicon = options.theme.favicon || {};
  var definitions = [
    { key: "desktop", rel: "shortcut icon", size: 48 },
    { key: "android", rel: "icon", size: 192, sizes: "192x192", type: "image/png" },
    { key: "apple", rel: "apple-touch-icon", size: 180, sizes: "180x180" }
  ];

  return definitions.filter(function (definition) {
    return favicon[definition.key];
  }).map(function (definition) {
    return {
      href: resolveUrl(favicon[definition.key], definition.size, options),
      rel: definition.rel,
      sizes: definition.sizes,
      type: definition.type
    };
  });
}

module.exports = { buildFaviconViewModel: buildFaviconViewModel };
