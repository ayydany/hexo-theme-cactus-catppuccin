# AGENTS.md (hexo-theme-cactus-catppuccin)

Catppuccin fork of the Hexo Cactus theme. Its main consumer is the site at `../ayydany.com`, which installs this repo as the npm dependency `hexo-theme-cactus`, pinned to a commit SHA.

## Checks

- `npm test`: render tests (`test/`) plus config validation.
- `npm run lint`: jshint and stylint. Fails on JS errors and Stylus errors. Stylus warnings (there are ~150 existing ones) are reported but do not fail.
- CI (`.github/workflows/ci.yml`) runs both on pushes to `master` and on pull requests. Keep it green, and update tests in `test/` when you intentionally change rendered output.

## Developing against the site

Do **not** push a theme commit and re-pin the site to preview each change, because every push to the site's `master` deploys to production. Use the local loop documented in `../ayydany.com/AGENTS.md` ("Theme Development Loop"):

1. In `../ayydany.com`, run `npx gulp themeLink` and then `npx gulp dev`.
2. Edit here. The site picks up changes live.
3. Run `npm test && npm run lint` here, then commit and push.
4. In `../ayydany.com`, run `npx gulp themeUnlink` and then `npx gulp themeBump`, and make one pin commit.

Keep the theme generic. Site-specific values (links, names, copy) belong in the site's `_config.cactus.yml`, with defaults in this repo's `_config.yml`.
