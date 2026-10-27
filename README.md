# NEON GEARSTORM (working title) — v1.1.4

A neon + steampunk vertical shoot-'em-up for phones (PWA), by **Rainwater Games**.
Play: https://rainwatergames.github.io/neon-gearstorm/

- Plain JS + Canvas 2D, no dependencies. Source in `src/`, bundle built to `build/game.js` with `node tools/build.js`.
- Debug: `?debug=boss` (jump to boss, invincible, max weapon), `?debug=mid`, `?debug=inv`, add `laser`/`tesla`, `autostart`, `stage2`, `boss2`, `stage3`, `boss3`, `s2only` (end the run after boss 2).

© 2026 Rainwater Games (Jeff Rainwater). All rights reserved. See LICENSE — not open source.

## v1.1.4
- Audio distortion fix (reported on Android + headset, Stage 1 and the Stage 1 boss). Cause: the old master bus (-20dB compressor with makeup gain -> x1.25 -> -3dB "limiter" with makeup) took a pre-master mix peaking at about +10.7 dBFS (stacked sub-bass booms/bombs/boss-death explosions, no voice limit) and squashed it to -0.3 dBFS. The limiter pumped hard and bent the low end on every big hit.
- New master: gain 0.7 -> one compressor/limiter (-6 dB, 12:1, 2 ms attack) -> soft-knee safety clipper with a -1 dBFS ceiling. SFX are capped at 3 of the same sound and 16 total. Sub-bass is 4.4 dB lower. Music ducks briefly on big explosions, bombs, boss deaths and hull hits. Every voice disconnects its nodes when it ends.
- Guitar: same rig, cleaner. Shaper drive 28 -> 12, a 3.6 kHz lowpass after the shaper to take out the fizz, wah peak +14 -> +8 dB, output .16 -> .12. Chug output .2 -> .15.
- Test: `node tools/v114audio.js <url>` renders 24 s of music plus heavy SFX offline for Stage 1, the Stage 1 boss, Stage 3 and Boss 3, and checks peak <= -1 dBFS with 0 clipped samples (`--raw` measures the pre-master bus).

## v1.1.3
- Touch BOMB button moved to the TOP-LEFT, just under the SHIELD/HULL bars / boss bar (8px gap, computed from the canvas scale), and made ~60% smaller (44–58px, 47px on a 412-wide phone) with a label that fits; clear of pause/mute. Saved bomb-side settings reset to LEFT once more. Test: `node tools/v111bomb.js <url>` (shots/v112-bomb-*.png).

## v1.1.1
- Touch BOMB button moved to mid-left (vertically centred, scales 60–96px with screen, safe-area aware, clamped clear of SHIELD/HULL bars and the bottom HUD) in portrait and landscape. Saved bomb-side settings are reset to LEFT once. Test: `node tools/v111bomb.js <url>`.

## v1.1 — Stage 3: Speed Run Rail Chase
- After the Iron Foundry boss the run continues into Stage 3: ~2x scroll sold by thin cyan/purple speed rails and motion-blurred ties (never round/red), chasing an armored steampunk train on twisting neon track.
- Track switches (left lane: medals x2 score + gatling risk; right lane: salvage), a dark tunnel lit by a headlight cone + neon signals with enemies bracketed/flashed in, turret cars, gatling caboose (spin-up telegraph), flatbeds launching drones, signal gantries with green-lit gaps.
- Boss 3 IRON LOCOMOTIVE: cars destroyed rear-first then detach and tumble; engine firebox + smokestack mortar barrage (marked impact squares) + telegraphed cowcatcher ram + steam-whistle shockwave with safe gaps; armored core; big DERAILED death. Then RUN COMPLETE (Stage 4 coming later).
- New music: 172 bpm stage track and 184 bpm boss-3 track with squealing leads.
- Tests: `node tools/v11.js <url>`; difficulty model: `TRIALS=3 node tools/v11model.js <url> "<config>"`.

## v0.5
- Bomb button defaults to the LEFT (left:14px, 104px up + safe area); Settings → BOMB BUTTON toggles L/R. Old saved values are reset to LEFT once.
- Always-newest updates: service worker fetches pages / game.js / version.json with no-store, `game.js?v=` stamped at build, `version.json` check reloads once on the title screen or shows "NEW VERSION — TAP TO UPDATE". A stale v0.4 client upgrades on its first open (`tools/v05cache.js`).
- Stage 2 + Iron Foundry boss much harder; big visible upgrades (Overdrive Core LV4/5, Option Pods, Homing Missiles, bigger dmg/fire steps, muzzle flash, shield bubble). Model: `node tools/v05.js <url> model`.
- Synth distorted lead guitar (waveshaper, wah, bends, vibrato, dive bombs, palm-muted chugs, solos) on stage 2 and both boss tracks.
- Drill-lunge warning column: bright pulsing column, dashed borders, marching chevrons, "⚠ DRILL LUNGE".
