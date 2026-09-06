import test from 'node:test'
import assert from 'node:assert/strict'

import { INTRO_STAGES } from '../src/introSequence.js'
import { normalizeMerchantCount } from '../src/introControls.js'

test('scene 1 continues through the Figma onboarding sequence in order', () => {
  assert.deepEqual(INTRO_STAGES, [
    'estimate',
    'reward-1000',
    'avatar',
    'reward-2000',
    'upload',
    'reward-3000',
    'invite',
    'reward-4000',
  ])
})

test('merchant count accepts manual input and stays within the stepper range', () => {
  assert.equal(normalizeMerchantCount('35'), 35)
  assert.equal(normalizeMerchantCount(''), 1)
  assert.equal(normalizeMerchantCount('-4'), 1)
  assert.equal(normalizeMerchantCount('120'), 99)
})
