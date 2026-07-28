const { buildProfileViewModel } = require("./lib/profile-view-model.cjs");

hexo.extend.helper.register("profile_view_model", function () {
  return buildProfileViewModel({
    gravatar: this.gravatar.bind(this),
    site: this.config,
    theme: this.theme,
    urlFor: this.url_for.bind(this)
  });
});
