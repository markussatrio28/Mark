# Design direction: Violet threshold, cosmic heart, hidden letter

## Reference reading

The opening reference sets violet blossoms against an almost-black night, leaving breathing room through the middle. The second reference turns a spiral galaxy into a heart shape: icy blue light traces its arms while a warm gold core anchors the center. The experience moves from that quiet floral threshold into a deep-space birthday reveal, then lets the central heart break into the puzzle pieces that open a letter. The next clearing carries those memories on a violet film strip, with warm paper captions and gentle mechanical motion.

## Three dials

- **Contrast:** ink-dark night, lavender petals, blue-white starlight, and a small warm-gold core.
- **Ornament:** floral framing belongs to the PIN threshold; the birthday reveal uses stars, orbit lines, and one luminous heart. The puzzle keeps the same cosmic image; the memories use a tactile film edge, perforations, and a small reel hub.
- **Motion:** the PIN panel becomes a door as its lock descends and turns; the heart then dissolves into a 3×3 set of image pieces. The film strip advances by swipe, buttons, or deliberate playback.

## Palette and type

- Night: `#090718`, `#050611`
- Bloom: `#6824ac`, `#8738cf`, `#bc68f2`, `#e5a7ff`
- Cosmic blue: `#383a9a`, `#8177e8`, `#b2dcff`
- Warm heart light: `#ffe4b0`; soft text: `#f6efff`
- Display: system serif stack; interface: system sans-serif stack. No remote fonts are required.

## Page one: PIN threshold

- Full-height, mobile-first night scene with the supplied flower reference optimized as a local WebP.
- The centered PIN keypad has six positions, large touch targets, keyboard input, clear, backspace, live status, and visible focus.
- Fine inset trim and small hinges make the rounded PIN panel read as a locked door. A correct PIN sends the lock to the center, turns its shackle, and opens the two panel leaves into the birthday reveal.

## Page two: birthday reveal

- The supplied galaxy reference becomes a local WebP backdrop, darkened enough to preserve heading contrast.
- “Happy Birthday” and `[NAME]` sit above one dimensional nebula heart. A short, non-personal wish keeps the focus on the greeting.
- The heart uses layered light, depth, a slow perspective sway, and two quiet orbital rings with moving lavender starlights instead of a heavy 3D engine.
- The doorway grows out of the PIN panel, then the camera moves through its open leaves as the star field and heart settle into focus with a restrained fade and scale, without a corner light flare.

## Page three: image puzzle and letter

- A touch-first 3×3 tile puzzle uses the supplied galaxy image as a temporary picture. Selecting one piece and then another swaps their positions; a shuffle control starts a new solvable arrangement.
- When all nine tiles are correctly placed, a folded letter control appears. Pressing it unfolds a readable paper card with the `[ISI_SURAT]` placeholder.
- During the scroll from the birthday reveal, the heart image breaks into matching tiles. The completed morph lines up with the playable puzzle below.

## Page four: memories on film

- Four mobile-first photo frames travel inside a continuous film strip, with sprocket holes and an understated reel wheel.
- Each frame pairs a photo placeholder with its date and memory caption. Swipe, keyboard arrows, or large touch controls move through the strip; autoplay is opt-in.
- Photo paths and captions live in the `memories` array in `assets/js/entrance.js`. Leave `image` empty to keep the placeholder, then add a relative image path when a photo is ready.

## Page five: gerbera finale

- The film reel is a finite viewing sequence. Once all four frames have been seen, the small **Lanjut scroll** cue appears and the final scene becomes available below it.
- The closing is deliberately quiet: three original inline-SVG gerbera blooms in violet shades, a soft pool of light, and a short birthday wish. The flowers reveal one after another when the visitor scrolls into the scene.
- Flower art is vector-based and local to the page, so it stays crisp on phones without adding a large image download. Motion honors `prefers-reduced-motion`.

## Motion, mobile, and accessibility

- Ambient transforms and opacity drive the petals, starlight, background breathing, and heart movement.
- Motion is reduced when `prefers-reduced-motion` is enabled. The birthday heading receives focus after the transition.
- All scenes respect safe-area insets, dynamic viewport height, keyboard/touch interaction, and compact screens. Puzzle tiles and the letter control are keyboard operable.
- Both reference images are optimized and self-hosted. No remote fonts, external animation packages, or large 3D runtime are needed.
