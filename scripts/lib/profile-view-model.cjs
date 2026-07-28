var styleMap = {
  brands: "fa-brands",
  brand: "fa-brands",
  solid: "fa-solid",
  regular: "fa-regular",
  light: "fa-light",
  thin: "fa-thin",
  duotone: "fa-duotone",
  "sharp-solid": "fa-sharp fa-solid",
  "sharp-regular": "fa-sharp fa-regular",
  "sharp-light": "fa-sharp fa-light",
  "sharp-thin": "fa-sharp fa-thin"
};

function iconClasses(link) {
  var rawStyle = String(link.style || link.icon_style || link.prefix || "").trim();
  var classes = "fa-brands";

  if (rawStyle.includes(" ")) {
    classes = rawStyle;
  } else if (rawStyle) {
    var normalized = rawStyle.replace(/^fa-/i, "").toLowerCase();
    classes = styleMap[normalized] || (rawStyle.match(/^fa-/i) ? rawStyle : "fa-" + normalized);
  }

  return classes + " fa-" + link.icon;
}

function buildLinks(links, urlFor) {
  return (links || []).map(function (link) {
    var href = link.link;
    var isMail = link.icon === "mail" || (typeof href === "string" && href.startsWith("mailto:"));
    var isRss = link.icon === "rss";
    var target = link.target || (isMail ? "_self" : "_blank");

    return {
      href: isMail || isRss ? href : urlFor(href),
      iconClasses: isMail ? "fa-solid fa-envelope" : (isRss ? "fa-solid fa-rss" : iconClasses(link)),
      isIdentity: !isMail,
      label: link.label || link.icon,
      rel: link.rel || (target === "_blank" ? "noopener" : ""),
      target: target
    };
  });
}

function buildProfileViewModel(options) {
  var theme = options.theme;
  var profile = theme.profile_page || {};
  var name = profile.name || options.site.author || options.site.title;
  var avatar = profile.avatar || {};
  var avatarUrl = avatar.url;
  var styleVars = [];

  if (profile.width) {
    styleVars.push("--profile-card-max-width:" + profile.width);
    if (!profile.content_width) {
      styleVars.push("--profile-content-max-width:" + profile.width);
    }
  }
  if (profile.content_width) {
    styleVars.push("--profile-content-max-width:" + profile.content_width);
  }

  if (!avatarUrl && theme.logo && theme.logo.url) {
    avatarUrl = options.urlFor(theme.logo.url);
  }
  if (avatar.gravatar && theme.gravatar && (theme.gravatar.email || theme.gravatar.hash)) {
    avatarUrl = theme.gravatar.email
      ? options.gravatar(theme.gravatar.email, 320)
      : "https://www.gravatar.com/avatar/" + theme.gravatar.hash + "?s=320";
  }
  if (avatarUrl && !avatarUrl.match(/^https?:\/\//i) && !avatarUrl.startsWith("//") && !avatarUrl.startsWith("data:")) {
    avatarUrl = options.urlFor(avatarUrl);
  }

  return {
    avatarAlt: avatar.alt || name,
    avatarUrl: avatarUrl,
    intro: profile.intro,
    links: buildLinks(
      profile.links && profile.links.length ? profile.links : theme.social_links,
      options.urlFor
    ),
    location: profile.location,
    name: name,
    style: styleVars.join(";"),
    title: profile.title || profile.role
  };
}

module.exports = { buildProfileViewModel: buildProfileViewModel };
