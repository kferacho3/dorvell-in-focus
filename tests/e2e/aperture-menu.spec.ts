import { expect, test } from '@playwright/test'

/**
 * Module A — Aperture Menu.
 *
 * Everything asserted here is a behaviour that degrades silently when it
 * breaks: a menu that opens but cannot be escaped, focus that never returns to
 * the trigger, or `aria-expanded` drifting out of step with what is on screen.
 * None of those produce an error in the console.
 */

test.use({ viewport: { width: 390, height: 844 } })

const menu = '[data-aperture-menu]'
const trigger = `${menu} summary`

test.describe('aperture menu', () => {
  test('opens and closes from the trigger', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator(trigger)).toHaveAttribute('aria-expanded', 'false')

    await page.locator(trigger).click()
    await expect(page.locator(menu)).toHaveAttribute('open', '')
    await expect(page.locator(trigger)).toHaveAttribute('aria-expanded', 'true')

    await page.locator(trigger).click()
    await expect(page.locator(menu)).not.toHaveAttribute('open', '')
    await expect(page.locator(trigger)).toHaveAttribute('aria-expanded', 'false')
  })

  test('Escape closes it and returns focus to the trigger', async ({ page }) => {
    await page.goto('/')
    await page.locator(trigger).click()
    await expect(page.locator(menu)).toHaveAttribute('open', '')

    await page.keyboard.press('Escape')

    await expect(page.locator(menu)).not.toHaveAttribute('open', '')
    // Losing focus to <body> here would strand a keyboard user at the top of
    // the document with no indication of where they were.
    await expect(page.locator(trigger)).toBeFocused()
  })

  test('moves focus into the menu when it opens', async ({ page }) => {
    await page.goto('/')
    await page.locator(trigger).click()

    await expect(page.locator(`${menu} a`).first()).toBeFocused()
  })

  test('keeps Tab inside the open menu', async ({ page }) => {
    await page.goto('/')
    await page.locator(trigger).click()
    await expect(page.locator(menu)).toHaveAttribute('open', '')

    // Tab well past the number of links and confirm focus never escapes.
    for (let i = 0; i < 14; i += 1) {
      await page.keyboard.press('Tab')
      const inside = await page.evaluate((selector) => {
        const panel = document.querySelector(selector)
        return panel instanceof Element && document.activeElement
          ? panel.contains(document.activeElement)
          : false
      }, menu)
      expect(inside, `focus escaped the menu after ${i + 1} tabs`).toBe(true)
    }
  })

  test('survives being reversed mid-animation', async ({ page }) => {
    await page.goto('/')

    // Open, interrupt part-way, then reopen. The state machine must settle
    // rather than getting stuck in `opening` or `closing`.
    await page.locator(trigger).click()
    await page.waitForTimeout(120)
    await page.locator(trigger).click()
    await page.waitForTimeout(120)
    await page.locator(trigger).click()

    await expect(page.locator(menu)).toHaveAttribute('open', '')
    await expect(page.locator(menu)).toHaveAttribute('data-state', 'open', {
      timeout: 2000,
    })
    await expect(page.locator(trigger)).toHaveAttribute('aria-expanded', 'true')
  })

  test('a menu link navigates', async ({ page }) => {
    await page.goto('/')
    await page.locator(trigger).click()

    await page.locator(`${menu} a[href="/archive"]`).click()
    await expect(page).toHaveURL(/\/archive$/)
  })
})
