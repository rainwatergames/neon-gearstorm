// Build: concatenate src/*.js into one IIFE bundle at build/game.js
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'..');
const order=['sprites.js','audio.js','stage2.js','main.js']; // v1.2.0: stage3.js removed (see git tag stage3-railchase-archive)
const V='1.2.0';
const hdr='/*! NEON GEARSTORM v'+V+' — © 2026 Rainwater Games (Jeff Rainwater). All rights reserved.\n *  Unauthorized copying, distribution or modification of this file is prohibited. */\n';
const body=order.map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
fs.mkdirSync(path.join(root,'build'),{recursive:true});
fs.writeFileSync(path.join(root,'build/game.js'),hdr+"(()=>{'use strict';\n"+body+"\n})();\n");
// v0.5: stamp version into index.html script tag + version.json (cache-busting)
let ih=fs.readFileSync(path.join(root,'index.html'),'utf8');ih=ih.replace(/build\/game\.js(\?v=[\d.]+)?"/,'build/game.js?v='+V+'"').replace(/(id="ver">)v[\d.]+/,'$1v'+V).replace(/<!-- v[\d.]+/,'<!-- v'+V).replace(/install\.js(\?v=[\d.]+)?"/,'install.js?v='+V+'"');fs.writeFileSync(path.join(root,'index.html'),ih);fs.writeFileSync(path.join(root,'version.json'),JSON.stringify({v:V})+'\n');
console.log('built build/game.js',fs.statSync(path.join(root,'build/game.js')).size,'bytes');
