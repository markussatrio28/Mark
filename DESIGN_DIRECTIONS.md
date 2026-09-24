# Design direction — Enchanted Lavender Garden

## Reference reading

The reference is a portrait view down a quiet garden aisle at twilight. The stone path narrows toward a lavender bench, while tall trees and lilac blooms form a canopy overhead. Soft, out-of-focus flowers frame the sides and top; tiny warm lights sit deep in the foliage. Its visual strength comes from layered depth and a calm focal point, not from decorative effects alone.

Translate that composition into a secret-garden journey: the visitor enters through a shadowed floral threshold, follows a softly lit path through memories, pauses at a letter, then reaches a quiet final clearing. Keep the path, flower canopy, bench-like focal point, warm pin lights, and foreground blur as recurring motifs. Draw a new web scene with CSS and inline SVG rather than copying the reference image.

## Art direction

- **Mood:** intimate, peaceful, romantic, nostalgic, softly magical. Mature and editorial rather than cute or celebratory-template-like.
- **Palette:** near-black plum `#17121d`, deep violet `#30203f`, garden purple `#644a7b`, lavender `#aa8bc5`, muted lilac `#d0bbdc`, dusty mauve `#b989a6`, warm ivory `#f4ede5`, and firefly amber `#e9c98d`. Use dark-to-light layers; never fill the whole page with one purple.
- **Light:** twilight gradients, low-opacity radial bloom, a small number of warm bokeh/firefly points, and subtle illumination around the path. Keep glow soft, local, and non-neon.
- **Depth and composition:** deep garden silhouettes in the background, a central path and sparse focal point in the middle ground, and a few blurred botanical shapes at the edges. Text and content sit in clear readable areas. The garden scene should be light, vector/CSS-based, and responsive.
- **Typography:** native editorial serif stacks (Iowan Old Style / Palatino / Georgia) and system sans stacks (Apple system / Segoe UI). This keeps the page crisp without downloading web fonts on mobile. Use compact uppercase tracking only for small labels. No handwriting font.
- **Spacing:** 8px rhythm; mobile gutters 22–26px, desktop 7–10vw; section vertical spacing 88px mobile / 128px desktop; content width around 1120px. Preserve generous negative space around the focal message.
- **Components:** quiet translucent dark panels with thin lavender/ivory borders; editorial photo frames with restrained offset, soft corners only where useful; large touch-friendly CTA; slim path/progress markers. Photos use explicit `[PHOTO_01]`… placeholders until the owner supplies images.
- **Animation:** slow opacity/translate reveals, slight blur-to-sharp for garden layers, gentle firefly drift, and one subdued entrance transition. Animate transform/opacity; cap the light particles. Respect `prefers-reduced-motion`, and keep all content readable without animation.
- **Responsive strategy:** mobile-first; use `100svh` with safe-area padding and a `100vh` fallback. Keep the path and text centered, decorations at the edges, cards in a vertical editorial sequence, buttons at least 44px tall, and all interactions tap/click accessible. Desktop widens the same scene and uses more negative space without changing the narrative.
- **Performance/accessibility:** no video, canvas, remote fonts, or remote imagery; use CSS and a small local SVG scene, lazy-load owner-provided photos, semantic sections/buttons, descriptive image alt text, visible focus, sufficient text contrast, and no autoplay audio.

## Journey

1. **Entrance:** “Come a little closer…” over the flower-framed garden; CTA “Enter the Garden”.
2. **First clearing:** “Happy Birthday, [NAME]” and an invitation to follow the path.
3. **Memory path:** four editable photo/date/caption placeholders arranged as editorial moments, not a grid.
4. **Birthday letter:** a readable personal note with a reveal and a skip-to-read option.
5. **Hidden light:** one discoverable flower/light reveals `[HIDDEN_MESSAGE]` and warms the garden slightly.
6. **Deep garden:** quieter final message `[FINAL_MESSAGE]`, with a calm warm glow.

## Content source of truth

Keep all personal text, name, date, photo paths, captions, and hidden/final messages together in one `GARDEN_DATA` object in `assets/js/garden-data.js`. Leave honest placeholders where no personal information or photos have been provided. Do not invent the couple's history.

## Selected direction

**Enchanted Lavender Garden** supersedes the earlier Afterglow Cinema exploration for this reference-led iteration. Preserve the editorial restraint from that direction, while making the garden pathway and layered twilight scene the main visual identity.
