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

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpassword')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Test User logged in')).not.toBeVisible()
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
        const createdBlog = page.locator('.blog').filter({ hasText: 'a blog test' })

        await createdBlog.getByRole('button', { name: 'view' }).click()
        await createdBlog.getByRole('button', { name: 'like' }).click()

        await expect(createdBlog.getByText('likes 1', { exact: false })).toBeVisible()
      })

      test('blog can be deleted by its creator', async ({ page }) => {
        const createdBlog = page.locator('.blog').filter({ hasText: 'a blog test' })

        await createdBlog.getByRole('button', { name: 'view' }).click()

        page.on('dialog', dialog => dialog.accept())
        await createdBlog.getByRole('button', { name: 'remove' }).click()

        await expect(page.locator('.blog').filter({ hasText: 'a blog test' })).not.toBeVisible()
      })

      test('only the creator sees the delete button', async ({ page, request }) => {
        await request.post('/api/users', {
          data: {
            name: 'New User',
            username: 'newuser',
            password: 'newpassword'
          }
        })

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'newuser', 'newpassword')

        const blog = page.locator('.blog').filter({ hasText: 'a blog test' })
        await blog.getByRole('button', { name: 'view' }).click()

        await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    describe('and multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'blog with 1 likes', 'Author 1', 'https://test1.com')
        await createBlog(page, 'blog with 2 likes', 'Author 2', 'https://test2.com')
        await createBlog(page, 'blog with 3 likes', 'Author 3', 'https://test3.com')
      })

      test('blogs are ordered by likes, most likes first', async ({ page }) => {
        const blog3 = page.locator('.blog').filter({ hasText: 'blog with 3 likes' })
        await blog3.getByRole('button', { name: 'view' }).click()
        await blog3.getByRole('button', { name: 'like' }).click()
        await expect(blog3.getByText('likes 1', { exact: false })).toBeVisible()
        await blog3.getByRole('button', { name: 'like' }).click()
        await expect(blog3.getByText('likes 2', { exact: false })).toBeVisible()
        await blog3.getByRole('button', { name: 'like' }).click()
        await expect(blog3.getByText('likes 3', { exact: false })).toBeVisible()

        const blog2 = page.locator('.blog').filter({ hasText: 'blog with 2 likes' })
        await blog2.getByRole('button', { name: 'view' }).click()
        await blog2.getByRole('button', { name: 'like' }).click()
        await expect(blog2.getByText('likes 1', { exact: false })).toBeVisible()
        await blog2.getByRole('button', { name: 'like' }).click()
        await expect(blog2.getByText('likes 2', { exact: false })).toBeVisible()

        const blog1 = page.locator('.blog').filter({ hasText: 'blog with 1 likes' })
        await blog1.getByRole('button', { name: 'view' }).click()
        await blog1.getByRole('button', { name: 'like' }).click()
        await expect(blog1.getByText('likes 1', { exact: false })).toBeVisible()

        const blogs = page.locator('.blog')
        await expect(blogs.nth(0)).toContainText('blog with 3 likes')
        await expect(blogs.nth(1)).toContainText('blog with 2 likes')
        await expect(blogs.nth(2)).toContainText('blog with 1 likes')
      })
    })
  })
})
