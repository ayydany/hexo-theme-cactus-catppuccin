# Cactus Catppuccin 🌿

A responsive, clean, and minimalist [Hexo](https://hexo.io) theme. This is a standalone project inspired by the original [Cactus](https://github.com/probberechts/hexo-theme-cactus) theme, now fully infused with the [Catppuccin Mocha](https://github.com/catppuccin/catppuccin) palette.

✨ **[View the Live Demo](https://ayydany.com)**

---

## What makes it different?

This version is customized for a specific "developer-first" workflow:

- **Catppuccin Palettes:** Includes all four flavors: **Latte**, **Frappé**, **Macchiato**, and **Mocha**.
- **Configurable Branding:** Use the `title_prefix` setting to brand your browser tabs (e.g., `ayydany // About`).
- **Configurable Accent:** Choose your preferred Catppuccin color as the primary accent.
  - **Available Colors:** `rosewater`, `flamingo`, `pink`, `mauve`, `red`, `maroon`, `peach`, `yellow`, `green`, `teal`, `sky`, `sapphire`, `blue`, `lavender`.
- **Custom Callouts:** Built-in `.callout` CSS class for highlighted notices or alert boxes.
- **Refined UI:** Removed social sharing bloat and streamlined the post action menus.

## Quick Start

### 1. Installation

In your Hexo root directory:

```bash
git clone https://github.com/ayydany/hexo-theme-cactus-catppuccin themes/cactus-catppuccin
```

### 2. Update Site Config

Set the theme in your main `_config.yml`:

```yaml
theme: cactus-catppuccin
```

### 3. Custom Settings

Add these to your `_config.yml` (or `_config.cactus-catppuccin.yml`) to use the new features:

```yaml
# Available: catppuccin-latte, catppuccin-frappe, catppuccin-macchiato, catppuccin-mocha
colorscheme: catppuccin-mocha 
# Available Catppuccin colors (mauve, pink, blue, etc.)
accent_color: mauve
title_prefix: ayydany  # Your custom tab prefix
```

---

## Documentation

Since this is based on the excellent work by the Cactus team, most core features (Navigation, Projects, Social Links) follow the original configuration.

👉 **[View the Full Configuration Guide](https://github.com/probberechts/hexo-theme-cactus#configuration)**

## License

MIT © [Daniel Carmo](https://ayydany.com)
