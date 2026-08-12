import { expect, test } from '@playwright/test'

/**
 * The publication with JavaScript unavailable.
 *
 * "A core story is unreadable without client JavaScript" is a release blocker
 * (plan §14.5), so this is not a nice-to-have suite — it is the check that the
 * blocker is not being violated.
 *
 * Runs only in the `no-js` Playwright project, which disables JavaScript at the
 * browser context level.
 */

test.describe('without JavaScript', () => {
  test('the homepage renders its content and navigation', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Channels' }).first()).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('channel links navigate', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('navigation', { name: 'Channels' })
      .first()
      .getByRole('link', { name: '4KFERG' })
      .click()

    await expect(page).toHaveURL(/\/motion$/)
    await expect(page.locator('h1')).toHaveText('4KFERG')
  })

  test('a story is fully readable', async ({ page }) => {
    await page.goto('/motion')

    const link = page.locator('a[href^="/story/"]').first()
    test.skip((await link.count()) === 0, 'no published stories in this environment')

    await link.click()

    await expect(page.locator('h1')).toBeVisible()
    // The body must be present, not just the headline — a page that renders
    // its title and nothing else still fails a reader.
    await expect(page.locator('article')).not.toBeEmpty()
  })

  test('search works as a plain form submission', async ({ page }) => {
    await page.goto('/search')

    await page.locator('#q').fill('braid')
    await page.getByRole('button', { name: 'Search' }).click()

    await expect(page).toHaveURL(/\/search\?q=braid/)
    await expect(page.getByRole('search')).toBeVisible()
  })

  test('the mobile menu opens as a native disclosure', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const summary = page.locator('details[data-aperture-menu] summary')
    await expect(summary).toBeVisible()

    await summary.click()
    // <details> toggles without a script; the Aperture Menu only enhances it.
    await expect(page.locator('details[data-aperture-menu]')).toHaveAttribute('open', '')
  })
})
