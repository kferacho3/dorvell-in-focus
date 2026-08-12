import { expect, test } from '@playwright/test'

/**
 * Navigation must work at every capability tier.
 *
 * The shared story frame is an enhancement layered over ordinary links. These
 * tests exist to prove the enhancement cannot become a requirement — the
 * failure this guards against is a transition that swallows a click and strands
 * the reader, which the plan lists as release-blocking (§14.5).
 */

test.describe('channel navigation', () => {
  test('reaches every channel from the masthead', async ({ page }) => {
    await page.goto('/')

    for (const [label, path] of [
      ['FERG Photography', '/photography'],
      ['4KFERG', '/motion'],
    ] as const) {
      await page
        .getByRole('navigation', { name: 'Channels' })
        .first()
        .getByRole('link', { name: label })
        .click()
      await expect(page).toHaveURL(new RegExp(`${path}$`))
      await page.goto('/')
    }
  })

  test('marks the current channel without relying on colour', async ({ page }) => {
    await page.goto('/motion')

    /*
     * Asserted against the DOM rather than a single nav instance, because the
     * header renders channel navigation twice — once for wide viewports and
     * once inside the menu — and which one is visible depends on the width.
     *
     * aria-current is the machine-readable signal; the rule and bullet are the
     * visual ones. Colour alone would fail forced-colours mode.
     */
    const current = page.locator('[data-channel-nav] a[aria-current="page"]')

    // Asserted on href rather than the label: the visible text carries an
    // aria-hidden bullet, and the channel's *name* is a CMS value that may
    // change (ADR-0004). The route is the stable fact, and it is what makes
    // "the right link is marked" unambiguous.
    expect(await current.count()).toBeGreaterThan(0)
    for (const link of await current.all()) {
      await expect(link).toHaveAttribute('href', '/motion')
    }

    // And nothing else claims to be current.
    await expect(page.locator('[data-channel-nav] a[aria-current="page"]')).toHaveCount(
      await page.locator('[data-channel-nav]').count(),
    )
  })
})

test.describe('story navigation', () => {
  test('opens a story and returns with the back button', async ({ page }) => {
    await page.goto('/motion')

    const link = page.locator('a[href^="/story/"]').first()
    test.skip((await link.count()) === 0, 'no published stories in this environment')

    const href = await link.getAttribute('href')
    await link.click()

    await expect(page).toHaveURL(new RegExp(`${href}$`))
    await expect(page.locator('h1')).toBeVisible()

    await page.goBack()
    await expect(page).toHaveURL(/\/motion$/)
  })

  test('navigates without errors in the console', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(String(error)))

    await page.goto('/motion')
    const link = page.locator('a[href^="/story/"]').first()
    test.skip((await link.count()) === 0, 'no published stories in this environment')

    await link.click()
    await page.waitForLoadState('load')

    expect(errors).toEqual([])
  })
})

test.describe('accessibility fundamentals', () => {
  test('skip link is the first focusable element and reaches main', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')

    const focused = page.locator(':focus')
    await expect(focused).toHaveText(/skip to content/i)

    await focused.press('Enter')
    await expect(page.locator('#main')).toBeFocused()
  })

  test('every page has exactly one h1', async ({ page }) => {
    for (const path of ['/', '/motion', '/archive', '/about', '/search']) {
      await page.goto(path)
      await expect(page.locator('h1'), `${path} should have one h1`).toHaveCount(1)
    }
  })

  test('the admin panel is never indexable', async ({ page }) => {
    const response = await page.goto('/admin')
    expect(response?.headers()['x-robots-tag']).toContain('noindex')
  })
})
