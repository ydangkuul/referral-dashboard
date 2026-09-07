import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const css = readFileSync(new URL('../src/figma-overrides.css', import.meta.url), 'utf8')

test('Network opens on the Figma My network overview scene', () => {
  assert.match(app, /useState\('Network'\)/)
  assert.match(app, /useState\('returning'\)/)
  assert.match(app, /useState\('overview'\)/)
  assert.match(app, /function NetworkOverviewScreen/)
  assert.match(app, /<h1>My network<\/h1>/)
  assert.match(app, /Earn points when you invite/)
  assert.match(app, /Contacts.*Invite.*Invited.*Nudge.*Registered.*Connect.*Influencer.*Connect.*Merchant.*Connect/s)
})

test('Network overview actions continue into the existing contact flows', () => {
  assert.match(app, /onInvite=\{\(\) => \{\s*setNetworkInitialTab\('Contacts'\)\s*setNetworkStage\('contacts'\)/s)
  assert.match(app, /onNudge=\{\(\) => \{\s*setNetworkInitialTab\('Invited'\)\s*setNetworkStage\('contacts'\)/s)
  assert.match(app, /onBack=\{\(\) => setNetworkStage\('overview'\)\}/)
})

test('Network overview preserves the 390px Figma geometry and VietPay tokens', () => {
  assert.match(css, /Network overview — Figma node 1070:7668/)
  assert.match(css, /\.network-overview-banner[\s\S]*width: 342px;[\s\S]*height: 68px;/)
  assert.match(css, /\.network-overview-row[\s\S]*height: 90px;/)
  assert.match(css, /\.network-overview-title h1[\s\S]*color: #0d3c7d;[\s\S]*font-size: 24px;/)
})
