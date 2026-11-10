# AGENTS.md (hexo-theme-cactus-catppuccin)

Catppuccin fork of the Hexo Cactus theme. Its main consumer is the site at `../ayydany.com`, which installs this repo as the npm dependency `hexo-theme-cactus`. The site's CI always builds with this repo's latest `master`, so **`master` here ships to production** on the next site deploy.

## Checks

- `npm test`: render tests (`test/`) plus config validation.
- `npm run lint`: jshint and stylint. Fails on JS errors and Stylus errors. Stylus warnings (there are ~150 existing ones) are reported but do not fail.
- CI (`.github/workflows/ci.yml`) runs both on pushes to `master` and on pull requests. Keep it green, and update tests in `test/` when you intentionally change rendered output.

## Developing against the site

Don't merge to `master` to preview a change. Use the local loop documented in `../ayydany.com/AGENTS.md` ("Theme Development Loop"):

1. In `../ayydany.com`, run `npx gulp themeLink` and then `npx gulp dev`.
2. Edit here. The site picks up changes live.
3. Run `npm test && npm run lint` here, then commit and push.
4. In `../ayydany.com`, run `npx gulp themeUnlink`. The next site deploy picks up the new theme `master` automatically. Pinning is optional and only affects local builds.

Keep the theme generic. Site-specific values (links, names, copy) belong in the site's `_config.cactus.yml`, with defaults in this repo's `_config.yml`.
