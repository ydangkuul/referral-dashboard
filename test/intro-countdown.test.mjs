import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('dynamic intro countdown uses the supplied text-free badge asset', async () => {
  const css = await readFile(new URL('../src/intro.css', import.meta.url), 'utf8')
  const badgeRule = css.match(/\.intro-countdown-badge\s*\{([^}]*)\}/)?.[1]

  assert.ok(badgeRule, 'expected the intro countdown badge CSS rule to exist')
  assert.match(
    badgeRule,
    /background-image:\s*url\(['"]?\/images\/countdown-badge\.png['"]?\)/,
    'the dynamic countdown must use the supplied text-free badge asset',
  )
})
