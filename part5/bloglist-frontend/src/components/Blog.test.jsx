import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

const blog = {
  title: 'Test',
  author: 'Test Author',
  url: 'https://test.com',
  likes: 5,
  user: { username: 'testuser', name: 'Test User' }
}

describe('<Blog />', () => {
  test('renders blog title as a link', () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>
    )

    expect(screen.getByText('Test by Test Author')).toBeDefined()
    expect(screen.queryByText('like')).toBeNull()
  })
})

