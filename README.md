# Ricky Criss — portfolio

Static portfolio published by the GitHub Pages workflow on pushes to main.

## Preview the portfolio

From the repository root, run `python -m http.server 5174` and open http://localhost:5174/.

## Corner14 learning project

The React/Vite demo is in `projects/ai-studio-app`. It uses sample data and does not require an AI API key or an Express backend.

From that directory:

```powershell
npm install
npm run lint
npm run build
```

The portfolio links to the committed `projects/ai-studio-app/dist/index.html`. Rebuild and commit that output with source and lockfile changes before publishing. Never place service credentials in client code or Vite replacement values.

## Dependency maintenance

Run `npm audit` in the demo directory. Prefer compatible updates and confirm the typecheck, production build, and demo behavior after changes. The local audit report is diagnostic output; do not publish it with the site.
