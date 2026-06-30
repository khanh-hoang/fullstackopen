import Blog from './Blog'

const BlogList = ({ blogs }) => {
  return (
    <ul>
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </ul>
  )
}

export default BlogList
