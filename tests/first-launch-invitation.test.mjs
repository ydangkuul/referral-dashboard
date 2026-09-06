import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const sequenceSource = await readFile(new URL('../src/introSequence.js', import.meta.url), 'utf8')
const introSource = await readFile(new URL('../src/IntroFlow.jsx', import.meta.url), 'utf8')
const appSource = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')

test('first launch continues from invitation video through share and 4,000-point reward', () => {
  assert.match(sequenceSource, /'invite',\s*'invitation-share',\s*'reward-4000'/s)
  assert.match(introSource, /stage === 'invitation-share'/)
})

test('invitation share supports editing, copying, and all four share channels', () => {
  assert.match(introSource, /Edit message/)
  assert.match(introSource, /navigator\.clipboard\.writeText/)
  for (const channel of ['Zalo', 'Messenger', 'SMS', 'Email']) {
    assert.match(introSource, new RegExp(`>${channel}<`))
  }
})

test('intro flow remains isolated to first launch mode', () => {
  assert.match(appSource, /launchMode === 'first' && !introCompleted/)
  assert.doesNotMatch(appSource, /launchMode === 'returning'[\s\S]{0,160}<IntroFlow/)
})
