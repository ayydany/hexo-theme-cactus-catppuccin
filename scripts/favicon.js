const { buildFaviconViewModel } = require("./lib/favicon-view-model.cjs");

hexo.extend.helper.register("favicon_view_model", function () {
  return buildFaviconViewModel({
    gravatar: this.gravatar.bind(this),
    theme: this.theme,
    urlFor: this.url_for.bind(this)
  });
});
