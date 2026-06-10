# MyWebApp

Personal website for Daniel Hoffmann Anton.

Live site: <https://www.hoff-daniel.xyz/>

This is a static HTML/CSS/JavaScript site with project pages, portfolio content,
and sandbox experiments.

## Branches

- `main`: production-ready source of truth.
- `deploy/hostinger`: exact branch used for manual Hostinger uploads.
- `develop`: integration branch for active work.
- `feature/<name>`: short-lived branches for individual changes.

## Local Preview

From the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the Hostinger upload workflow.
