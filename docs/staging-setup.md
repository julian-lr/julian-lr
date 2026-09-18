# Staging environment setup (Cloudflare dashboard)

This repo has a `staging` branch on GitHub that mirrors `main` and can be
pushed to independently for testing before merging to `main`. Cloudflare's
side of this is dashboard configuration, not code, so it's documented here
instead of in `wrangler.jsonc`.

## Current setup

- **GitHub**: `staging` branch exists, currently in sync with `main`.
  Workflow: push work-in-progress to `staging` → verify it → merge to `main`
  when ready to go live.
- **Cloudflare Worker (`julianlr`)**: connected via Git integration.
  - **Settings → Build → Branch control**: Production branch = `main`,
    "Builds for non-production branches" = enabled. This means every push to
    `staging` (or any other branch) triggers a build automatically.

## Making staging builds viewable

By default, a build on a non-production branch uploads a new Worker
*version* but doesn't expose a stable URL. To get a stable, shareable link
that always reflects the current `staging` branch:

1. **Worker → Settings → Domains & Routes → Worker URL**: turn on the
   **Preview** toggle (`*-julianlr.<subdomain>.workers.dev`).
2. **Worker → Settings → Build → Non-production branch deploy command**: set
   to:
   ```
   npx wrangler versions upload --preview-alias $WORKERS_CI_BRANCH
   ```
   `WORKERS_CI_BRANCH` is a Cloudflare-injected env var containing the git
   branch name being built, so this automatically names the alias after
   whatever non-production branch triggered the build.
3. After a push to `staging`, the build becomes reachable at:
   ```
   https://staging-julianlr.<subdomain>.workers.dev
   ```

## Why `staging.julianlr.com` doesn't work as a Custom Domain here

Cloudflare Workers **Custom Domains always route to the Production
deployment** — they cannot be scoped to a branch or preview version. Adding
`staging.julianlr.com` as a Custom Domain on the same `julianlr` Worker used
for production would just mirror `julianlr.com`, not the `staging` branch.
Don't add it there; use the Preview URL approach above instead.

## Upgrade path: a real `staging.julianlr.com`

If a permanent custom-domain staging site (not a `workers.dev` link) is ever
wanted, that requires a second, separate Worker:

1. Add a named `staging` environment to `wrangler.jsonc` (e.g. `env.staging`
   with its own `name`, such as `julianlr-staging`).
2. Run `wrangler deploy --env staging` once to create that second Worker on
   the account.
3. Connect that new Worker's Git integration to this same repository, but
   set **its** production branch to `staging` (so pushes to `staging` deploy
   to *its* production, independent of the main `julianlr` Worker).
4. Move the `staging.julianlr.com` Custom Domain from the `julianlr` Worker
   to the new `julianlr-staging` Worker.
5. Redeclare any bindings/secrets (e.g. `RESEND_API_KEY`) for the new
   environment — they are not inherited automatically.

This is more setup and a second deployed Worker to maintain, so it wasn't
done by default — the `workers.dev` preview alias above covers the same
need (testing before merging to `main`) without the extra infrastructure.
