# NEON GEARSTORM (working title) — v0.5

A neon + steampunk vertical shoot-'em-up for phones (PWA), by **Rainwater Games**.
Play: https://rainwatergames.github.io/neon-gearstorm/

- Plain JS + Canvas 2D, no dependencies. Source in `src/`, bundle built to `build/game.js` with `node tools/build.js`.
- Debug: `?debug=boss` (jump to boss, invincible, max weapon), `?debug=mid`, `?debug=inv`, add `laser`/`tesla`, `autostart`.

© 2026 Rainwater Games (Jeff Rainwater). All rights reserved. See LICENSE — not open source.

## v0.5
- Bomb button defaults to the LEFT (left:14px, 104px up + safe area); Settings → BOMB BUTTON toggles L/R. Old saved values are reset to LEFT once.
- Always-newest updates: service worker fetches pages / game.js / version.json with no-store, `game.js?v=` stamped at build, `version.json` check reloads once on the title screen or shows "NEW VERSION — TAP TO UPDATE". A stale v0.4 client upgrades on its first open (`tools/v05cache.js`).
- Stage 2 + Iron Foundry boss much harder; big visible upgrades (Overdrive Core LV4/5, Option Pods, Homing Missiles, bigger dmg/fire steps, muzzle flash, shield bubble). Model: `node tools/v05.js <url> model`.
- Synth distorted lead guitar (waveshaper, wah, bends, vibrato, dive bombs, palm-muted chugs, solos) on stage 2 and both boss tracks.
- Drill-lunge warning column: bright pulsing column, dashed borders, marching chevrons, "⚠ DRILL LUNGE".
