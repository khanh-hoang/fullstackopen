import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Test',
  author: 'Test Author',
  url: 'https://test.com',
  likes: 5,
  user: { username: 'testuser', name: 'Test User' }
}

describe('<Blog />', () => {
  test('renders title and author, but not URL or likes by default', () => {
    const { container } = render(
      <Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} loggedUser={null} />
    )

    expect(screen.getByText('Test', { exact: false })).toBeDefined()
    expect(screen.getByText('Test Author', { exact: false })).toBeDefined()
    expect(container.querySelector('.blog-details')).toBeNull()
    expect(screen.queryByText('https://test.com')).toBeNull()
    expect(screen.queryByText('likes', { exact: false })).toBeNull()
  })

  test('shows URL and likes after clicking view', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} loggedUser={null} />
    )

    await user.click(screen.getByText('view'))

    const details = container.querySelector('.blog-details')
    expect(details).not.toBeNull()
    expect(screen.getByText('https://test.com')).toBeDefined()
    expect(screen.getByText('likes', { exact: false })).toBeDefined()
  })

  test('clicking like twice calls handler twice', async () => {
    const mockLike = vi.fn()
    const user = userEvent.setup()

    render(
      <Blog blog={blog} handleLike={mockLike} handleDelete={() => {}} loggedUser={null} />
    )

    await user.click(screen.getByText('view'))
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})

