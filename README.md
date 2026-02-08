# KHQR Package Hub

## Overview

This is a Vite + React + TypeScript project using shadcn-ui and Tailwind CSS.

## Requirements

- Node.js 20+ (LTS recommended)
- npm 9+

## Maintainers

![Konthaina GitHub avatar](https://github.com/konthaina.png?size=50)

## Local Setup

```sh
# Clone
git clone <YOUR_GIT_URL>
cd khqr-showcase-hub

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Scripts

```sh
npm run dev       # Start dev server
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build
npm run lint      # Lint
npm run test      # Run tests
```

## Build Output

Vite outputs production files to `dist/`.

## Deploy to GitHub Pages (Project Site)

This repo is configured for GitHub Pages at:

`https://konthaina.github.io/khqr-package-hub/`

### 1) Vite base path

`vite.config.ts` is set with:

```ts
base: "/khqr-package-hub/"
```

### 2) Router base

`BrowserRouter` uses `basename={import.meta.env.BASE_URL}` in `src/App.tsx` so routes work under `/khqr-package-hub/`.

### 3) GitHub Actions workflow

The workflow file is:

`.github/workflows/deploy.yml`

It builds the app and deploys the `dist/` folder to GitHub Pages on every push to `main`.

### 4) Enable Pages

In GitHub:

Settings → Pages → Source: **GitHub Actions**

## Troubleshooting

### 404 on refresh

GitHub Pages does not support SPA history fallback by default. If you refresh a deep link, you might see 404.

Options:
- Switch to `HashRouter` for zero-config routing on Pages.
- Add a `404.html` redirect fallback if you want clean URLs.

### Deployment failure at “Configure Pages”

Make sure:
- The repo is **Public**, or your plan allows Pages on private repos.
- Pages source is set to **GitHub Actions**.

Then re-run the workflow in **Actions**.
