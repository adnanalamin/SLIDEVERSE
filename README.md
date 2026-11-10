<div align="center">

# ✦ SLIDEVERSE

### The Ultimate Open-Source Slider Collection

**Create. Animate. Slide.**

Reusable, responsive slider components for the web — each with a live demo and readable source.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-in%20development-orange.svg)](#project-status)
[![GitHub stars](https://img.shields.io/github/stars/adnanalamin/SLIDEVERSE?style=social)](https://github.com/adnanalamin/SLIDEVERSE)

[Explore the repository](https://github.com/adnanalamin/SLIDEVERSE) · [Report a bug](https://github.com/adnanalamin/SLIDEVERSE/issues) · [Request a slider](https://github.com/adnanalamin/SLIDEVERSE/issues)

</div>

---

## ✨ About

SLIDEVERSE is an open-source home for reusable slider components. Each component is a **standalone folder** with its own page, styles and script, plus one entry in the catalogue site.

**Currently available: 1 component** — the [Product Showcase Slider](product-showcase-slider/). Further sliders will be listed only after they are implemented and tested.

- Live site: https://adnanalamin.github.io/SLIDEVERSE/
- Live demo: https://adnanalamin.github.io/SLIDEVERSE/product-showcase-slider/
- Source folder: https://github.com/adnanalamin/SLIDEVERSE/tree/main/product-showcase-slider

## 🧰 Technologies

Plain HTML5, CSS3 and vanilla JavaScript. No framework, no build step, no backend — it runs as static files on GitHub Pages.

## 📁 Project structure

```text
SLIDEVERSE/
├── index.html                  # catalogue site
├── assets/
│   ├── css/style.css           # catalogue styles
│   └── js/
│       ├── sliders.js          # the catalogue data (one object per slider)
│       └── main.js             # search, filters, favorites, preview, code viewer, image manager
├── product-showcase-slider/    # the component (self-contained)
│   ├── index.html
│   ├── css/style.css
│   ├── js/script.js
│   ├── assets/images/          # fallback illustrations + screenshots
│   └── README.md
├── .github/  CONTRIBUTING.md  CODE_OF_CONDUCT.md  SECURITY.md  LICENSE
```

## 🖱️ What each button does

| Button | Action |
|---|---|
| **Preview** | Opens the real slider (`product-showcase-slider/index.html`) in a preview window. |
| **View Code** | Loads the component's actual `index.html`, `css/style.css` and `js/script.js` into separate tabs. |
| **Copy Code** | Copies the source of the tab you are looking at. |
| **Live Demo** | Opens the standalone slider page in a new tab. |
| **GitHub** | Opens the component's folder on GitHub. |
| **Images** | Opens the image manager (below). |
| **♡ Favorite** | Adds/removes the slider from Favorites (saved in your browser). |
| **Search / chips** | Filter the catalogue by text, category and technology. **Clear filters** resets all of them. |

View Code loads files with `fetch`, so open the site through GitHub Pages or a local server (`python -m http.server`), not by double-clicking `index.html`.

## 🖼️ Image manager

Click **Images** on a slider card to try your own pictures in the slider:

- **Upload images** (multiple), **+ Add image** (one), **Replace**, **Remove**, **Remove all**.
- Reorder by **drag and drop** or with the ◀ ▶ buttons.
- JPG, JPEG, PNG, WebP and GIF, up to 10 MB each. Each image shows its filename, dimensions, type and size, and has its own unique ID.
- Image 1 replaces the first product photo, image 2 the second, and so on (8 slots). Unused slots keep their original photo.

**Important:** these images are stored **in your own browser** (IndexedDB). A static GitHub Pages site cannot save uploads to the repository, so other visitors and other devices will not see them. Clearing site data removes them.

### Adding images to the repository permanently

1. Copy your image files into `product-showcase-slider/assets/images/` (for example `aurora.jpg`).
2. Open `product-showcase-slider/js/script.js`, find the `PRODUCTS` array and add a `custom` path to the product that should use the image:
   ```js
   { id: 'aurora-pro', category: 'Headphones', name: 'Aurora Pro Wireless Headphones',
     photo: 'photo-1505740420928-5e560c06d30e', fallback: 'assets/images/headphones.svg',
     custom: 'assets/images/aurora.jpg', /* ← your image, relative to the component's index.html */ },
   ```
3. Commit and push. GitHub Pages republishes in a minute or two. (Images chosen in the browser image manager still take priority on your own device.)

## ➕ Adding another component

1. Create a root-level folder, e.g. `my-slider/`, with its own `index.html`, styles, script and `assets/` (use relative paths only).
2. Append one object to `assets/js/sliders.js` (`demo`, `files`, `slots`, `thumb` are documented at the top of that file). The card, filters, pagination, Live Demo, GitHub link, preview and code viewer all appear automatically.

## 🚀 Deploying on GitHub Pages

Repository **Settings → Pages → Deploy from a branch → `main` / root**. Every path in the project is relative, so it works under `https://<user>.github.io/SLIDEVERSE/`.

## 🧩 Component quality goals

Every published component should aim to include:

- Responsive layouts for mobile, tablet and desktop
- Working previous/next controls and pagination where relevant
- Touch and swipe support where appropriate
- Keyboard interaction and accessible labels
- Reduced-motion support
- Clear, reusable and commented code
- No broken controls or unfinished placeholder interactions
- A preview and setup instructions

## 🤝 Contributing

Contributions are welcome: new slider ideas, bug fixes, accessibility improvements, documentation and performance enhancements.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## ❤️ Support SLIDEVERSE

SLIDEVERSE is intended to remain free and open source. If this project becomes useful to you, you can support its development.

**Planned support methods**
- bKash — Bangladesh
- Nagad — Bangladesh
- Bank transfer — subject to transfer details and availability

Payment details and instructions will be published here only after the project owner has configured and verified the receiving accounts. **No payment number or bank account is active through this repository yet.**

Donations are voluntary. They do not unlock features, create a paid tier or change the MIT License permissions.

## 📜 License

SLIDEVERSE is released under the [MIT License](LICENSE). You may use, copy, modify, merge, publish, distribute, sublicense and/or sell copies of the software, subject to the license conditions.

Third-party assets and dependencies may have their own licenses. Check their terms before redistribution.

## 👤 Maintainer

**AL AMIN ADNAN**

GitHub: [@adnanalamin](https://github.com/adnanalamin)

---

<div align="center">

Made with care for the developer community.

**SLIDEVERSE — Create. Animate. Slide.**

</div>
