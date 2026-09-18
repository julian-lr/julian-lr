# Palette & typography — recommendations to consider later

This is a **wishlist, not applied changes**. The redesign kept the current
purple accent palette (`#646cff` / `#535bf2`) and `DM Serif Text` everywhere,
as requested. If a further visual refresh is ever on the table, here are
concrete, low-risk directions worth considering.

## Palette

**Current palette context:** `#646cff` / `#535bf2` is the stock Vite/React
starter-template purple, and `#213547` / `#1b1b1e` are its default text
colors. They work, but they don't say anything specific about martech/email
engineering — they read as "unstyled Vite app" to anyone who has seen the
default template.

Options, roughly in order of how big a jump they'd be from today:

1. **Keep the hue, deepen the identity.** Stay in the blue-violet family but
   shift to a less "default template" shade — e.g. an indigo/violet around
   `#5b4fdb`–`#4338ca` for primary, paired with a warm accent (amber `#f5a524`
   or coral `#ef6461`) used sparingly for status/CTA emphasis. Cheapest
   change, keeps brand continuity.
2. **Slate + single accent.** Move the neutral scale to a proper slate/zinc
   ramp (e.g. Tailwind's `slate-50`…`slate-900`) for backgrounds/text, and
   keep just one accent color doing all the work (links, active nav state,
   status "in progress" chips). Reads more "engineering portfolio," less
   "template."
3. **Two-tone martech identity.** Since the positioning is "email/martech +
   web engineering," a duotone of a deep blue (trust, enterprise martech) and
   a warm accent (creative/dev energy) could visually reinforce the pitch —
   similar to how SFMC/marketing-cloud brand material leans navy + gold.

Whichever direction: keep the same CSS variable names already introduced in
`src/index.scss` (`--color-link`, `--color-navbar-link-active`, etc.) — only
the values need to change, not every component.

## Typography

**Current setup:** `DM Serif Text` is used for literally everything —
headings, nav, body copy, form labels. It's a display serif; using it for
long paragraphs (About Me, Work Experience) hurts readability at small sizes
and slows scanning.

Recommendation: keep `DM Serif Text` for what it's good at — `h1`/`h2`
headings and the nav wordmark — and pair it with a clean, highly-legible
sans-serif for body text, labels, and UI chrome. Good pairings that keep the
same "editorial but modern" feel:

- **Public Sans** or **Inter** — neutral, excellent at small sizes, free and
  self-hostable (no new external dependency).
- **Source Serif 4** for body copy instead of a sans, if a more literary
  in the timeline sections without hurting legibility.

Any of these can be self-hosted the same way `DM Serif Text` already is
(`src/assets/fonts/`), avoiding a new external font-loading dependency.

## How to try these later

1. Add the new font files under `src/assets/fonts/` and a `@font-face` block
   in `src/index.scss`, then set body/paragraph selectors to the new
   font-family while leaving `h1`/`h2`/`.logo` on `DM Serif Text`.
2. Change only the hex values of the CSS variables in `src/index.scss`
   (`:root` and `[data-theme="dark"]`) — every component already reads
   colors through those variables, so a palette shift is a two-block edit,
   not a per-component rewrite.
