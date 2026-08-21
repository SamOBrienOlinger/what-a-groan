# DON'T EVEN TALK TO ME

A mobile-first dark-comedy game that turns ordinary bad luck into a gloriously unscientific score out of 100.

## Current release workflow

- `main` is reserved for reviewed and approved releases.
- `develop` contains the active preview-ready build.
- Feature work should branch from `develop` and return through pull requests.
- Nothing is merged into `main` without explicit approval.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Validate

```bash
npm run lint
npm test
```

The production build outputs a Cloudflare-compatible application in `dist/`. The game has no account, analytics or server-side player data.

## Preview deployment

The active `develop` branch is designed to be connected to a preview provider. Every pull request and every push to `develop` should run the included validation workflow before a preview is shared.
