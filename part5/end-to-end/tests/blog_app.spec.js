const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpassword'
      }
    })
    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpassword')

      const errorAlert = page.getByRole('alert')
      await expect(errorAlert).toContainText('wrong username or password')
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog test', 'Test Author', 'https://test.com')
      await expect(page.locator('.blog').filter({ hasText: 'a blog test' })).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'a blog test', 'Test Author', 'https://test.com')
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'a blog test by Test Author' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('1 likes', { exact: false })).toBeVisible()
      })

      test('blog can be deleted by its creator', async ({ page }) => {
        await page.getByRole('link', { name: 'a blog test by Test Author' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.locator('.blog').filter({ hasText: 'a blog test' })).not.toBeVisible()
      })
    })
  })
})
