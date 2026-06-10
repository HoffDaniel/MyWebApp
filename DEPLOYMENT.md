# Deployment

This project is currently deployed manually to Hostinger as a static website.

## Branch Workflow

- `main` is production-ready and should always represent a stable site.
- `deploy/hostinger` is the branch to upload from when publishing manually.
- `develop` is where active work lands before it is promoted to `main`.
- `feature/<name>` branches should branch from `develop` and merge back into
  `develop` when ready.

Recommended flow:

```bash
git switch develop
git switch -c feature/my-change
# make and test the change
git switch develop
git merge feature/my-change
git switch main
git merge develop
git switch deploy/hostinger
git merge main
```

Upload the contents of `deploy/hostinger` to Hostinger after testing it locally.

## Manual Hostinger Upload

Upload these runtime files and folders:

- `index.html`
- `scripts/`
- `view/`
- `resources/`

Do not upload these working/source folders:

- `.git/`
- `resources_dev/`
- `designs/`

## Pre-Upload Checklist

1. Run a local preview:

   ```bash
   python3 -m http.server 8000
   ```

2. Open <http://localhost:8000/> and check the home page, projects carousel,
   sandbox links, images, and browser console.
3. Make sure `git status` is clean on `deploy/hostinger`.
4. Upload the runtime files to Hostinger.
5. Tag the deployed commit:

   ```bash
   git tag live-YYYY-MM-DD
   ```

## Notes

The public site depends on files in `resources/`, so that folder should stay in
Git. Development-only material belongs in `resources_dev/` and remains ignored.
