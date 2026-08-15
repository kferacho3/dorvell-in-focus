import { expect, test } from '@playwright/test'

test.describe('Focal Lock', () => {
  test('uses one persistent, pointer-transparent frame', async ({ page }) => {
    await page.goto('/')

    const frame = page.locator('.focus-frame')
    await expect(frame).toHaveCount(1)
    await expect(frame).toHaveAttribute('aria-hidden', 'true')
    await expect(frame).toHaveCSS('pointer-events', 'none')

    await page.locator('[data-focus-id="channel-card-photography"]').hover()
    await expect(frame.locator('.focus-frame__label')).toHaveText('FERG Photography')

    await page.mouse.move(1, 1)
    await expect(frame.locator('.focus-frame__label')).toHaveText('FERG Photography')
  })

  test('follows keyboard focus and resolves the destination default', async ({
    page,
  }) => {
    await page.goto('/')

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const frame = page.locator('.focus-frame')
    await expect(frame).toHaveAttribute('data-mode', 'keyboard')
    await expect(frame.locator('.focus-frame__label')).toHaveText('Publication home')

    await page.locator('[data-focus-id="header-channel-motion"]').click()
    await expect(page).toHaveURL(/\/motion$/)
    await expect(frame.locator('.focus-frame__label')).toHaveText('4KFERG')
    await expect(frame).toHaveAttribute('data-point', 'true')
  })
})
