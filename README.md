# NEON GEARSTORM (working title) — v1.2.0

A neon + steampunk vertical shoot-'em-up for phones (PWA), by **Rainwater Games**. Two stages for now (The Brass Nebula, The Iron Foundry); more stages are coming in later versions.
Play: https://rainwatergames.github.io/neon-gearstorm/

- Plain JS + Canvas 2D, no dependencies. Source in `src/`, bundle built to `build/game.js` with `node tools/build.js`.
- Debug: `?debug=boss` (jump to boss, invincible, max weapon), `?debug=mid`, `?debug=inv`, add `laser`/`tesla`, `autostart`, `stage2`, `boss2` (old `stage3`/`boss3` links now start at boss 2, which leads to the ending).

© 2026 Rainwater Games (Jeff Rainwater). All rights reserved. See LICENSE — not open source.

## v1.2.0
- Stage 3 (rail chase / Iron Locomotive) removed. Neon Gearstorm is 2 stages for now while a better Stage 3 is designed. The old code is kept at git tag `stage3-railchase-archive`.
- After the Inferno Drill Engine (boss 2) the run ends on a new ending screen. It says "ALL STAGES CLEAR!" and "Thanks for testing! More stages coming in later versions." Below that are results (kills, hits taken), medals (collected, best chain), score and bonus, salvage earned, and UPGRADE / PLAY AGAIN / TITLE. A new victory theme plays on it, so the audio continues from the boss-2 death into the ending.
- Removed: the Stage 3 code, intro card and tips, boss 3, the Stage 3 and boss 3 music, the `stage3`/`boss3` debug flags (old links start at boss 2), and the Stage 3 screenshots and tests (tools/v11.js, tools/v11model.js). A run can no longer be in stage 3; if one somehow is, it goes straight to the ending.
- Tests: `node tools/v120.js <url>` checks the boss 2 -> ALL STAGES CLEAR flow, the results and medals, the music, the legacy links, and that no stage 3 code is left. tools/v115silence.js now follows boss 2 into the ending.

## v1.1.5
- Audio cutting out for good at the end of the Stage 2 boss. It did not reproduce in desktop headless Chrome (the audio stayed on through the boss death, stage clear and Stage 3). The probable phone causes are: (1) the OS suspends or "interrupts" the AudioContext and the old code only resumed it on a NEW touch, so a player holding their finger down got silence for the rest of the run; (2) a single bad (NaN) sample poisons the delay feedback and compressor, which means permanent silence. The old uncapped boss-death barrage made both more likely. Fix: a watchdog every 0.4 s, plus on every context state change. It resumes a suspended or interrupted context with no touch needed. It rebuilds the whole audio graph (and restarts the current music) if the context closes or the output contains a non-finite sample. Paused and backgrounded states are left alone. tools/v115silence.js tests it.
- Limiter and mix checked on every stage and boss: peaks are -1.6 to -1.8 dBFS with heavy SFX on Stage 1, Stage 2 and both bosses (tools/v114audio.js).
- BOMB button: a pulsing magenta glow ring (1.0-1.15 scale, 1.2 s) while bombs > 0, a white ping ring on pickup, and grey, dim and still at 0. With REDUCE FLASHING (or OS reduce-motion) it gets a gentle 2.4 s pulse and no ping.

## v1.1.4
- Audio distortion fix (reported on Android + headset, Stage 1 and the Stage 1 boss). Cause: the old master bus (-20dB compressor with makeup gain -> x1.25 -> -3dB "limiter" with makeup) took a pre-master mix peaking at about +10.7 dBFS (stacked sub-bass booms/bombs/boss-death explosions, no voice limit) and squashed it to -0.3 dBFS. The limiter pumped hard and bent the low end on every big hit.
- New master: gain 0.7 -> one compressor/limiter (-6 dB, 12:1, 2 ms attack) -> soft-knee safety clipper with a -1 dBFS ceiling. SFX are capped at 3 of the same sound and 16 total. Sub-bass is 4.4 dB lower. Music ducks briefly on big explosions, bombs, boss deaths and hull hits. Every voice disconnects its nodes when it ends.
- Guitar: same rig, cleaner. Shaper drive 28 -> 12, a 3.6 kHz lowpass after the shaper to take out the fizz, wah peak +14 -> +8 dB, output .16 -> .12. Chug output .2 -> .15.
- Test: `node tools/v114audio.js <url>` renders 24 s of music plus heavy SFX offline for Stage 1, the Stage 1 boss, Stage 2 and Boss 2, and checks peak <= -1 dBFS with 0 clipped samples (`--raw` measures the pre-master bus).

## v1.1.3
- Touch BOMB button moved to the TOP-LEFT, just under the SHIELD/HULL bars / boss bar (8px gap, computed from the canvas scale), and made ~60% smaller (44–58px, 47px on a 412-wide phone) with a label that fits; clear of pause/mute. Saved bomb-side settings reset to LEFT once more. Test: `node tools/v111bomb.js <url>` (shots/v112-bomb-*.png).

## v1.1.1
- Touch BOMB button moved to mid-left (vertically centred, scales 60–96px with screen, safe-area aware, clamped clear of SHIELD/HULL bars and the bottom HUD) in portrait and landscape. Saved bomb-side settings are reset to LEFT once. Test: `node tools/v111bomb.js <url>`.

## v1.1 — (Stage 3 rail chase: removed in v1.2.0, see the `stage3-railchase-archive` tag)

## v0.5
- Bomb button defaults to the LEFT (left:14px, 104px up + safe area); Settings → BOMB BUTTON toggles L/R. Old saved values are reset to LEFT once.
- Always-newest updates: service worker fetches pages / game.js / version.json with no-store, `game.js?v=` stamped at build, `version.json` check reloads once on the title screen or shows "NEW VERSION — TAP TO UPDATE". A stale v0.4 client upgrades on its first open (`tools/v05cache.js`).
- Stage 2 + Iron Foundry boss much harder; big visible upgrades (Overdrive Core LV4/5, Option Pods, Homing Missiles, bigger dmg/fire steps, muzzle flash, shield bubble). Model: `node tools/v05.js <url> model`.
- Synth distorted lead guitar (waveshaper, wah, bends, vibrato, dive bombs, palm-muted chugs, solos) on stage 2 and both boss tracks.
- Drill-lunge warning column: bright pulsing column, dashed borders, marching chevrons, "⚠ DRILL LUNGE".

## v1.3.0-dev (preview build, branch v1.3-dev — not published to Pages)
- **Stage 3 — THE XENO HIVE:** an organic alien world with pulsing hives that spawn swarmers, eggs that hatch, spitters, acid geysers and tentacle lanes. Each new mechanic gets a one-line hint banner the first time it appears. It has its own dark B-minor music.
  - **Boss — HIVE QUEEN:** telegraphed claw swipe (a red zone marked "⚠ CLAW SWIPE / SAFE"), an acid fan from a glowing mouth, and an egg sac that lobs eggs. Break both claws and the egg sac, then shoot the exposed eye.
- **Stage 4 — THE FROZEN CITADEL:** an ice-white and crimson fortress corridor. The walls carry destructible turrets, laser gates, wall-pivot sweep lasers and crushers that close and open (the green gap is safe). It has its own G-minor music.
  - **Boss — CRIMSON WARDEN:** two wall cannons and a laser prism; the laser lanes are telegraphed and always leave safe lanes, and the walls close in during a squeeze phase.
- **Ending:** after Stage 4 the game shows "ALL STAGES CLEAR! Thanks for testing! More stages coming in later versions."
- **Test links:** `?stage=3`, `?stage=3boss`, `?stage=4`, `?stage=4boss` (`?stage=2`/`2boss` still work).
- **Tests:** `node tools/v130.js` checks the links and runs a bot from Stage 3 through the ending; `node tools/v114audio.js` covers all stages and keeps peaks ≤ -1 dBFS. `tools/v120.js` checks the 4-stage flow and ending; `v115silence.js` covers audio through the boss 4 death into the ending.
- **Polish pass:** fewer and slower big bullets. Longer warnings: crushers 70 frames, laser gates 80, sweep lasers 100, Warden laser lanes 80, Queen claw swipe 80. The Warden lanes always leave 2 safe lanes. The wall squeeze only pushes you (no damage), and crushers only hurt if you're inside them as they slam. Damage against the new bosses is evened out across weapons: Tesla bolts ×2.5, laser pierce ×0.13.
