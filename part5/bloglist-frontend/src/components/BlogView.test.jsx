import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogView from './BlogView'

const blog = {
  title: 'Test',
  author: 'Test Author',
  url: 'https://test.com',
  likes: 5,
  user: { username: 'testuser', name: 'Test User' }
}

const renderBlogView = (loggedUser) =>
  render(
    <MemoryRouter>
      <BlogView
        blog={blog}
        handleLike={() => {}}
        handleDelete={() => {}}
        loggedUser={loggedUser}
      />
    </MemoryRouter>
  )

describe('<BlogView />', () => {
  test('displays blog info and likes to unauthenticated users, no buttons shown', () => {
    renderBlogView(null)

    expect(screen.getByRole('heading', { name: /Test/ })).toBeDefined()
    expect(screen.getByText('https://test.com')).toBeDefined()
    expect(screen.getByText('5', { exact: false })).toBeDefined()
    expect(screen.queryByText('like')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('shows only like button to authenticated user who is not the creator', () => {
    renderBlogView({ username: 'otheruser', name: 'Other User' })

    expect(screen.getByText('like')).toBeDefined()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('shows both like and delete buttons to the blog creator', () => {
    renderBlogView({ username: 'testuser', name: 'Test User' })

    expect(screen.getByText('like')).toBeDefined()
    expect(screen.getByText('remove')).toBeDefined()
  })
})
