import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * Derived from AxeBuilder rather than imported from `axe-core`, which is a
 * transitive dependency and so is not resolvable under pnpm's strict layout.
 */
type Violation = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'][number]

/**
 * Automated accessibility scanning.
 *
 * Worth being honest about what this is: axe catches roughly a third of real
 * accessibility problems. It reliably finds contrast failures, missing names,
 * and broken ARIA relationships — and it cannot tell you whether a heading
 * outline makes sense or whether the reading order matches the visual one.
 *
 * So this suite is a floor, not a certificate. The manual VoiceOver and NVDA
 * pass is still outstanding, and the accessibility statement says so.
 *
 * Critical and serious violations are release-blocking (plan §14.5). Moderate
 * and minor ones are reported but do not fail the build, because failing on
 * every minor finding is how a suite gets muted.
 */

const ROUTES = [
  ['/', 'homepage'],
  ['/photography', 'photography — light channel'],
  ['/motion', '4KFERG — the dark channel'],
  ['/stories', 'stories'],
  ['/modeling', 'modeling'],
  ['/x', 'FERG X'],
  ['/archive', 'archive'],
  ['/search', 'search'],
  ['/about', 'about'],
  ['/disclosures', 'disclosures'],
] as const

function format(violations: Violation[]): string {
  return violations
    .map(
      (v) =>
        `\n  [${v.impact}] ${v.id}: ${v.help}\n` +
        v.nodes
          .slice(0, 3)
          .map((n) => `    ${n.target.join(' ')}`)
          .join('\n'),
    )
    .join('')
}

test.describe('accessibility', () => {
  for (const [route, label] of ROUTES) {
    test(`${label} has no critical or serious violations`, async ({ page }) => {
      await page.goto(route)

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()

      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      )

      expect(blocking, `${route}${format(blocking)}`).toEqual([])
    })
  }

  test('the dark channel keeps sufficient contrast', async ({ page }) => {
    // 4KFERG inverts the palette, which is exactly where a token that was only
    // ever checked on paper turns out to fail.
    await page.goto('/motion')

    const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()

    expect(results.violations, format(results.violations)).toEqual([])
  })

  test('the open menu is accessible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.locator('[data-aperture-menu] summary').click()

    // Wait for the state machine to settle. Scanning mid-reveal measures a
    // transient frame — the clip circle is still at zero and opacity is 0, so
    // axe reports contrast failures against content nobody can see yet.
    await expect(page.locator('[data-aperture-menu]')).toHaveAttribute(
      'data-state',
      'open',
    )

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    )

    expect(blocking, format(blocking)).toEqual([])
  })

  test('a story page is accessible', async ({ page }) => {
    await page.goto('/motion')
    const link = page.locator('a[href^="/story/"]').first()
    test.skip((await link.count()) === 0, 'no published stories in this environment')

    await link.click()
    await page.waitForLoadState('load')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    )

    expect(blocking, format(blocking)).toEqual([])
  })
})
