// ===================== v2.0.0 MUSIC: one pumping track per new stage + a dedicated boss track each, plus a story (cutscene) cue =====================
// Modes: stage N (5..11) = 9+(N-5)*2, its boss = +1. 23 = story cue. Same 16th-step sequencer + master bus (limiter + -1.3dBFS soft clipper) as v1.x.
const GHOOK=[[0,62,2],[2,65,2],[4,69,4],[8,67,2],[10,65,2],[12,64,4],[16,62,2],[18,65,2],[20,72,6],[28,70,4],[32,69,3],[35,67,3],[38,65,2],[40,64,4],[44,65,2],[46,67,2],[48,69,6],[56,61,4],[60,64,4]];
const MHOOK=[[0,64,2],[2,67,2],[4,71,2],[6,67,2],[8,64,4],[12,71,4],[16,72,2],[18,71,2],[20,67,4],[24,64,8],[32,64,2],[34,67,2],[36,71,2],[38,74,2],[40,76,4],[44,74,4],[48,72,3],[51,71,3],[54,67,2],[56,63,8]];
const THOOK=[[0,69,1],[1,69,1],[2,72,2],[4,69,2],[6,67,2],[8,64,4],[12,67,4],[16,69,1],[17,69,1],[18,72,2],[20,76,2],[22,74,2],[24,72,8],[32,69,2],[34,72,2],[36,76,4],[40,77,4],[44,76,4],[48,74,4],[52,72,4],[56,71,8]];
const NHOOK=[[0,72,4],[4,71,2],[6,72,2],[8,76,6],[14,74,2],[16,72,4],[20,69,4],[24,71,8],[32,72,4],[36,74,2],[38,76,2],[40,79,6],[46,77,2],[48,76,4],[52,74,4],[56,72,8]];
const CHOOK=[[0,66,1],[1,69,1],[2,73,1],[3,76,1],[4,78,2],[6,76,2],[8,73,4],[12,69,4],[16,71,1],[17,74,1],[18,78,2],[20,76,4],[24,73,8],[32,66,2],[34,69,2],[36,73,2],[38,76,2],[40,78,4],[44,81,4],[48,78,4],[52,76,4],[56,73,8]];
const DHOOK=[[0,62,6],[6,65,2],[8,64,8],[16,60,4],[20,62,4],[24,57,8],[32,62,6],[38,65,2],[40,69,8],[48,67,4],[52,65,4],[56,64,8]];
const KHOOK=[[0,60,3],[3,63,3],[6,67,2],[8,68,4],[12,67,4],[16,63,3],[19,60,3],[22,63,2],[24,62,8],[32,60,2],[34,63,2],[36,67,2],[38,72,2],[40,71,4],[44,68,4],[48,67,3],[51,63,3],[54,62,2],[56,60,8]];
const SNG=(bpm,o)=>Object.assign({bpm},o);
const V2S=[
 // 5 GRAVITY WELL — D minor space-trance / boss: serpent, Bb minor
 SNG(132,{dark:1,ch:[[62,65,69],[58,62,65],[60,64,67],[57,61,64]],root:[38,46,48,45],hook:GHOOK,sec:[['intro',4,'k p lf S'],['drift',8,'k b h p a G'],['verse',8,'k b h s a p'],['chorus',8,'k b h s a p l c o G'],['break',4,'p lf a'],['drop',8,'k b h s a p l g c o r G']]}),
 SNG(168,{boss:1,ch:[[58,61,65],[54,58,61],[56,60,63],[53,57,60]],root:[46,42,44,41],hook:tr(GHOOK,-4),sec:[['siren',4,'S k G'],['heavy',8,'k b h s o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 6 MIRROR DIMENSION — E minor, glassy arps / boss: evil twin, E phrygian
 SNG(126,{dark:1,ch:[[64,67,71],[60,64,67],[62,66,69],[59,63,66]],root:[40,36,38,35],hook:MHOOK,sec:[['intro',4,'a p lf'],['glass',8,'k b h a p'],['verse',8,'k b h s a p l'],['chorus',8,'k b h s a p l c o G'],['break',4,'p a lf S'],['drop',8,'k b h s a p l g c o r G']]}),
 SNG(166,{boss:1,ch:[[64,67,71],[65,69,72],[64,67,71],[62,65,69]],root:[40,41,40,38],hook:tr(MHOOK,0),sec:[['siren',4,'S k G'],['heavy',8,'k b h s a o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 7 STORM CHASER — A minor, driving / boss: thundercloud, F# minor
 SNG(140,{dark:1,ch:[[57,60,64],[53,57,60],[55,59,62],[52,56,59]],root:[45,41,43,40],hook:THOOK,sec:[['intro',4,'k a p S'],['front',8,'k b h s a p G'],['verse',8,'k b h s a p l G'],['chorus',8,'k b h s a p l c o G'],['break',4,'p lf S'],['drop',8,'k b h s a p g c o r G']]}),
 SNG(174,{boss:1,ch:[[54,57,61],[50,54,57],[52,56,59],[49,53,56]],root:[42,38,40,37],hook:tr(THOOK,-3),sec:[['siren',4,'S k G'],['heavy',8,'k b h s o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 8 NEON HIGHWAY — bright synthwave C major / boss: tanker, C minor
 SNG(118,{ch:[[60,64,67],[57,60,64],[65,69,72],[67,71,74]],root:[48,45,53,55],hook:NHOOK,sec:[['intro',4,'k a p'],['cruise',8,'k b h s a p'],['verse',8,'k b h s a p l'],['chorus',8,'k b h s a p l c o'],['break',4,'p a lf'],['drop',8,'k b h s a p l c o r g']]}),
 SNG(160,{boss:1,ch:[[60,63,67],[56,60,63],[53,56,60],[55,59,62]],root:[48,44,41,43],hook:tr(NHOOK,-3),sec:[['siren',4,'S k G'],['heavy',8,'k b h s a o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 9 SHRINK RAY LAB — F# minor chip-tech / boss: virus, B minor
 SNG(136,{dark:1,ch:[[66,69,73],[62,66,69],[64,68,71],[61,65,68]],root:[42,38,40,37],hook:CHOOK,sec:[['intro',4,'a k'],['boot',8,'k b h a p'],['verse',8,'k b h s a p l'],['chorus',8,'k b h s a p l c o'],['break',4,'a lf S'],['drop',8,'k b h s a p l c o r G']]}),
 SNG(170,{boss:1,ch:[[59,62,66],[55,59,62],[57,61,64],[54,58,61]],root:[47,43,45,42],hook:tr(CHOOK,-7),sec:[['siren',4,'S k G'],['heavy',8,'k b h s a o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 10 DEEP SEA TRENCH — D dorian, slow heavy pump / boss: anglerfish, G minor
 SNG(104,{dark:1,ch:[[62,65,69],[60,64,67],[58,62,65],[57,60,64]],root:[38,36,34,33],hook:DHOOK,sec:[['intro',4,'p lf S'],['sink',8,'k b p lf G'],['verse',8,'k b h s p a'],['chorus',8,'k b h s a p l c G'],['break',4,'p lf S'],['drop',8,'k b h s a p l g c r G']]}),
 SNG(156,{boss:1,ch:[[55,58,62],[51,55,58],[53,57,60],[50,54,57]],root:[43,39,41,38],hook:tr(DHOOK,-7),sec:[['siren',4,'S k G'],['heavy',8,'k b h s o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 11 COLOSSUS — C minor epic march / boss: the Gearlord's giant body, fastest
 SNG(144,{dark:1,ch:[[60,63,67],[56,60,63],[58,62,65],[55,59,62]],root:[48,44,46,43],hook:KHOOK,sec:[['intro',4,'k a p S'],['march',8,'k b h s a p G'],['verse',8,'k b h s a p l G'],['chorus',8,'k b h s a p l c o G'],['break',4,'p lf S'],['drop',8,'k b h s a p g c o r G']]}),
 SNG(180,{boss:1,ch:[[60,63,67],[61,65,68],[56,60,63],[55,59,62]],root:[48,49,44,43],hook:tr(KHOOK,0),sec:[['siren',4,'S k G'],['heavy',8,'k b h s a o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G'],['solo',8,'k b h s o G Q r']]})];
for(const s of V2S)SONGS.push(s); // indices 9..22
SONGS.push(SNG(84,{dark:1,ch:[[57,60,64],[53,57,60],[55,59,62],[52,55,59]],root:[45,41,43,40],hook:tr(HOOK,-12),sec:[['story',8,'p a lf'],['story2',8,'p a S']]})); // 23 story cue
const vMus=(n,boss)=>9+(n-5)*2+(boss?1:0);
