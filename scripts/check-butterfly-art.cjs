#!/usr/bin/env node
'use strict';
// This revision is an artwork-only change. Deliberately guard the shared flight
// engine, firefly SVG, and animation stylesheet independently of the wing art.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'preview/butterfly.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'preview/butterfly.css'), 'utf8');
const first = source.indexOf('  const wing = ');
const last = source.indexOf('  function fireflyArt(index)');
const digest = value => createHash('sha256').update(value).digest('hex');
assert.ok(first > 0 && last > first, 'Artwork boundary must remain explicit');
assert.equal(digest(source.slice(0, first)), '1b35da473a04e2a3fe165f048c1298bb8f2e329aa7039058abe7a8f6a318c8db', 'Shared setup changed outside artwork scope');
assert.equal(digest(source.slice(last)), '1e2464709fcc2e57fde661516ea586a22ce5ec2b890b9450c2aeb50dcccde16c', 'Firefly artwork or shared behavior changed');
assert.equal(digest(css), '0f638439257856fb2c4b54854fc28297b989ccfff7f8e5c7802c99a9c6b2cd9a', 'Flight/flap/theme animation CSS changed');
const art = source.slice(first, last);
assert.match(art, /viewBox="0 0 100 96" aria-hidden="true" focusable="false"/, 'SVG geometry and decorative semantics must stay stable');
for (const name of ['butterfly-body', 'butterfly-wing butterfly-left', 'butterfly-wing butterfly-right', 'butterfly-antenna butterfly-antenna-left', 'butterfly-antenna butterfly-antenna-right', 'butterfly-glow']) {
  assert.equal(art.split(`class="${name}"`).length - 1, 1, `Animation hook ${name} must occur once in its template`);
}
assert.equal(art.split('transform="translate(100 0) scale(-1 1)"').length - 1, 2, 'Mirrored wing and antenna coordinates must remain unchanged');
assert.doesNotMatch(art, /<image\b|<filter\b|<script\b|\bon\w+=|https?:\/\//i, 'Artwork must remain lightweight local SVG paths');
console.log('PASS artwork-only scope, firefly/flight/CSS fingerprints, hinges, decorative semantics and local SVG');
