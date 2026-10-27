// Build: concatenate src/*.js into one IIFE bundle at build/game.js
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'..');
const order=['sprites.js','audio.js','stage2.js','main.js'];
const hdr='/*! NEON GEARSTORM v0.4 — © 2026 Rainwater Games (Jeff Rainwater). All rights reserved.\n *  Unauthorized copying, distribution or modification of this file is prohibited. */\n';
const body=order.map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
fs.mkdirSync(path.join(root,'build'),{recursive:true});
fs.writeFileSync(path.join(root,'build/game.js'),hdr+"(()=>{'use strict';\n"+body+"\n})();\n");
console.log('built build/game.js',fs.statSync(path.join(root,'build/game.js')).size,'bytes');
