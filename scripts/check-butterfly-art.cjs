#!/usr/bin/env node
'use strict';
// This revision is an artwork-only change. Deliberately guard the shared flight
// engine and animation stylesheet independently of both insect illustrations.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'preview/butterfly.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'preview/butterfly.css'), 'utf8');
const first = source.indexOf('  const wing = ');
const fireflyStart = source.indexOf('  function fireflyArt(index)');
const last = source.indexOf('  // Range boxes include');
const digest = value => createHash('sha256').update(value).digest('hex');
assert.ok(first > 0 && fireflyStart > first && last > fireflyStart, 'Both artwork boundaries must remain explicit');
assert.equal(digest(source.slice(0, first)), '1b35da473a04e2a3fe165f048c1298bb8f2e329aa7039058abe7a8f6a318c8db', 'Shared setup changed outside artwork scope');
// The old scope included fireflyArt in this hash. Both illustrations are now
// intentionally revised; the engine starts at the same untouched Range comment.
assert.equal(digest(source.slice(last)), 'a4b17e19e3b5f0e63b9403f95e859bef44005f0b4dc577a63d805021c43089bc', 'Shared flight, perches, theme handoff or lifecycle behavior changed');
assert.equal(digest(css), '0f638439257856fb2c4b54854fc28297b989ccfff7f8e5c7802c99a9c6b2cd9a', 'Flight/flap/theme animation CSS changed');
const art = source.slice(first, fireflyStart);
assert.match(art, /viewBox="0 0 100 96" aria-hidden="true" focusable="false"/, 'SVG geometry and decorative semantics must stay stable');
for (const name of ['butterfly-body', 'butterfly-wing butterfly-left', 'butterfly-wing butterfly-right', 'butterfly-antenna butterfly-antenna-left', 'butterfly-antenna butterfly-antenna-right', 'butterfly-glow']) {
  assert.equal(art.split(`class="${name}"`).length - 1, 1, `Animation hook ${name} must occur once in its template`);
}
assert.equal(art.split('transform="translate(100 0) scale(-1 1)"').length - 1, 2, 'Mirrored wing and antenna coordinates must remain unchanged');
assert.doesNotMatch(art, /<image\b|<filter\b|<script\b|\bon\w+=|https?:\/\//i, 'Artwork must remain lightweight local SVG paths');
assert.doesNotMatch(art, /<linearGradient\b|<radialGradient\b/, 'Butterfly uses broad flat planes, without naturalistic gradients or extra glow');
for (const color of ['#E9DFC9', '#263F35', '#252B28', '#A6533D', '#B28A47']) assert.ok(art.includes(color), `Butterfly palette missing ${color}`);
const firefly = source.slice(fireflyStart, last);
assert.match(firefly, /viewBox="0 0 64 64" aria-hidden="true" focusable="false"/, 'Firefly coordinate system stays stable');
for (const name of ['firefly-body', 'firefly-wing firefly-wing-left', 'firefly-wing firefly-wing-right']) {
  assert.equal(firefly.split(`class="${name}"`).length - 1, 1, `Firefly animation hook ${name} must occur once`);
}
assert.equal(firefly.split('class="firefly-lantern"').length - 1, 2, 'Both existing blink groups remain attached');
assert.ok(firefly.includes('const glow = `nh-firefly-glow-${index}`;'), 'Each firefly keeps a distinct gradient id');
assert.ok(firefly.includes('<radialGradient id="${glow}"><stop stop-color="#E9F5A4" stop-opacity=".7"/><stop offset=".25" stop-color="#D8E78A" stop-opacity=".3"/><stop offset=".55" stop-color="#CFD578" stop-opacity=".1"/><stop offset="1" stop-color="#D6E69B" stop-opacity="0"/></radialGradient>'), 'Existing radial halo colors and opacity remain exact');
assert.ok(firefly.includes('<circle cx="32" cy="39" r="24" fill="url(#${glow})"/>'), 'Halo position and radius remain exact');
assert.equal((firefly.match(/<radialGradient\b/g) || []).length, 1, 'Do not add glow layers');
assert.equal((firefly.match(/<circle\b/g) || []).length, 1, 'The halo is the only circle; do not add particles');
assert.doesNotMatch(firefly, /<image\b|<filter\b|<script\b|\bon\w+=|https?:\/\//i, 'Firefly stays local lightweight SVG');
console.log('PASS both artwork scopes, flight/CSS fingerprints, butterfly hinges, firefly halo/blink hooks and local SVG');
