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

  test('centers on visible nav labels and retargets from its live position', async ({
    page,
  }) => {
    await page.goto('/')
    await page.evaluate(() => sessionStorage.setItem('ferg-focal-lock-entry', 'seen'))
    await page.reload()

    const frame = page.locator('.focus-frame')
    const photography = page.locator('[data-focus-id="header-channel-photography"]')
    const stories = page.locator('[data-focus-id="header-channel-stories"]')

    await photography.hover()
    await expect(frame).not.toHaveAttribute('data-moving', 'true')

    const start = await frame.boundingBox()
    const photographyBox = await photography.boundingBox()
    expect(start).not.toBeNull()
    expect(photographyBox).not.toBeNull()
    expect(
      Math.abs(
        photographyBox!.x -
          start!.x -
          (start!.x + start!.width - (photographyBox!.x + photographyBox!.width)),
      ),
    ).toBeLessThan(1.5)

    if (
      await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      return
    }

    await stories.hover()
    await page.waitForTimeout(50)

    const midpoint = await frame.boundingBox()
    const storiesBox = await stories.boundingBox()
    expect(midpoint).not.toBeNull()
    expect(storiesBox).not.toBeNull()
    expect(midpoint!.x).toBeGreaterThan(start!.x + 1)
    expect(midpoint!.x).toBeLessThan(storiesBox!.x - 10)

    await expect(frame).not.toHaveAttribute('data-moving', 'true')
    const settled = await frame.boundingBox()
    expect(settled).not.toBeNull()
    expect(Math.abs(settled!.x - (storiesBox!.x - 10))).toBeLessThan(1.5)
  })
})
