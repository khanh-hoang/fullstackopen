import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with correct data on submit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <BlogForm createBlog={createBlog} />
    </MemoryRouter>
  )

  const titleInput = screen.getByLabelText('title')
  const authorInput = screen.getByLabelText('author')
  const urlInput = screen.getByLabelText('url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Test')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://test.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test',
    author: 'Test Author',
    url: 'https://test.com'
  })
})
