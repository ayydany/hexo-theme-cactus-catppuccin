import assert from "node:assert/strict";
import { cp, mkdtemp, mkdir, readFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import Hexo from "hexo";

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtureDir = path.join(repoDir, "test/fixtures/site");
const localThemeConfig = path.join(repoDir, "test/fixtures/local-theme.yml");

let siteDir;
let localSiteDir;
const paletteSiteDirs = {};

async function generateSite(themeConfig) {
  const directory = await mkdtemp(path.join(tmpdir(), "cactus-theme-test-"));
  await cp(fixtureDir, directory, { recursive: true });
  await mkdir(path.join(directory, "themes"));
  await symlink(path.join(repoDir, "node_modules"), path.join(directory, "node_modules"), "dir");
  await symlink(repoDir, path.join(directory, "themes/cactus-catppuccin"), "dir");
  if (themeConfig) {
    await cp(themeConfig, path.join(directory, "_config.cactus-catppuccin.yml"));
  }

  const hexo = new Hexo(directory, { silent: true });
  hexo.env.init = true;
  await hexo.init();
  await hexo.call("generate");
  await hexo.exit();

  return directory;
}

before(async () => {
  siteDir = await generateSite();
  localSiteDir = await generateSite(localThemeConfig);
  for (const flavor of ["frappe", "latte", "macchiato", "mocha"]) {
    paletteSiteDirs[flavor] = await generateSite(
      path.join(repoDir, "test/fixtures/palettes", `catppuccin-${flavor}.yml`)
    );
  }
});

after(async () => {
  await rm(siteDir, { force: true, recursive: true });
  await rm(localSiteDir, { force: true, recursive: true });
  await Promise.all(
    Object.values(paletteSiteDirs).map((directory) =>
      rm(directory, { force: true, recursive: true })
    )
  );
});

test("renders site identity from configuration", async () => {
  const html = await readFile(path.join(siteDir, "public/index.html"), "utf8");

  assert.match(html, /<title>test \/\/ Test Author<\/title>/);
  assert.match(html, /<span class="h1"><a href="\/archives\/">Writing<\/a><\/span>/);
});

test("preserves nested defaults and honors utterances issue terms", async () => {
  const html = await readFile(
    path.join(siteDir, "public/2026/01/01/example/index.html"),
    "utf8"
  );

  assert.match(html, /var utterances_issue_term = 'title'/);
  assert.match(html, /script\.setAttribute\('issue-term', utterances_issue_term\)/);
  assert.match(html, /var utterances_label = 'Comment'/);
});

test("renders representative layouts and compiled styles", async () => {
  const archive = await readFile(path.join(siteDir, "public/archives/index.html"), "utf8");
  const errorPage = await readFile(path.join(siteDir, "public/404.html"), "utf8");
  const profile = await readFile(path.join(siteDir, "public/about/index.html"), "utf8");
  const styles = await readFile(path.join(siteDir, "public/css/style.css"), "utf8");

  assert.match(archive, /id="archive"/);
  assert.match(errorPage, /404 Page Not Found/);
  assert.match(profile, /class="profile-page"/);
  assert.match(profile, /Profile page content/);
  assert.match(styles, /border-radius: 8px/);
});

test("renders equivalent CDN and local asset adapters", async () => {
  const cdnHtml = await readFile(path.join(siteDir, "public/index.html"), "utf8");
  const cdnPost = await readFile(
    path.join(siteDir, "public/2026/01/01/example/index.html"),
    "utf8"
  );
  const localHtml = await readFile(path.join(localSiteDir, "public/index.html"), "utf8");
  const packageJson = JSON.parse(await readFile(path.join(repoDir, "package.json"), "utf8"));
  const localAssets = {
    clipboard: await readFile(
      path.join(localSiteDir, "public/lib/clipboard/clipboard.min.js"),
      "utf8"
    ),
    fontAwesome: await readFile(
      path.join(localSiteDir, "public/lib/font-awesome/css/all.min.css"),
      "utf8"
    ),
    gallery: await readFile(
      path.join(localSiteDir, "public/lib/justified-gallery/js/jquery.justifiedGallery.min.js"),
      "utf8"
    ),
    jquery: await readFile(
      path.join(localSiteDir, "public/lib/jquery/jquery.min.js"),
      "utf8"
    )
  };

  assert.match(cdnHtml, new RegExp(`/jquery/${packageJson.dependencies.jquery}/`));
  assert.match(
    cdnHtml,
    new RegExp(`/font-awesome/${packageJson.dependencies["@fortawesome/fontawesome-free"]}/`)
  );
  assert.match(cdnPost, new RegExp(`/clipboard\.js/${packageJson.dependencies.clipboard}/`));
  assert.match(
    cdnPost,
    new RegExp(`/justifiedGallery/${packageJson.dependencies.justifiedGallery}/`)
  );
  assert.match(localHtml, /\/lib\/jquery\/jquery\.min\.js/);
  assert.doesNotMatch(localHtml, /cdnjs\.cloudflare\.com\/ajax\/libs\/jquery/);
  assert.match(localAssets.jquery, new RegExp(`jQuery v${packageJson.dependencies.jquery}`));
  assert.match(
    localAssets.fontAwesome,
    new RegExp(`Font Awesome Free ${packageJson.dependencies["@fortawesome/fontawesome-free"]}`)
  );
  assert.match(localAssets.clipboard, new RegExp(`clipboard\\.js v${packageJson.dependencies.clipboard}`));
  assert.match(
    localAssets.gallery,
    new RegExp(`justifiedGallery - v${packageJson.dependencies.justifiedGallery}`)
  );
});

test("keeps browser behavior in external assets", async () => {
  const post = await readFile(
    path.join(siteDir, "public/2026/01/01/example/index.html"),
    "utf8"
  );
  const search = await readFile(path.join(siteDir, "public/search/index.html"), "utf8");
  const mainScript = await readFile(path.join(siteDir, "public/js/main.js"), "utf8");
  const searchScript = await readFile(path.join(siteDir, "public/js/search.js"), "utf8");

  assert.match(post, /data-copy-label="Copy to clipboard!"/);
  assert.doesNotMatch(post, /var clip = new ClipboardJS/);
  assert.match(mainScript, /new ClipboardJS/);
  assert.match(search, /data-search-path="\/search\.xml"/);
  assert.doesNotMatch(search, /var \$inputArea/);
  assert.match(searchScript, /MutationObserver/);
});

test("compiles every Catppuccin palette", async () => {
  const expectedBackgrounds = {
    frappe: "#303446",
    latte: "#eff1f5",
    macchiato: "#24273a",
    mocha: "#1e1e2e"
  };

  for (const [flavor, background] of Object.entries(expectedBackgrounds)) {
    const styles = await readFile(
      path.join(paletteSiteDirs[flavor], "public/css/style.css"),
      "utf8"
    );
    assert.match(styles, new RegExp(`background-color: ${background}`));
  }
});
