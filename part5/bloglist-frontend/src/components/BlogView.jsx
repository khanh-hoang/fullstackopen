import { useNavigate } from 'react-router-dom'
import { Paper, Button } from '@mui/material'

const BlogView = ({ blog, handleLike, handleDelete, loggedUser }) => {
  const navigate = useNavigate()

  if (!blog) return null

  const isOwner = loggedUser && blog.user?.username === loggedUser.username

  const onDelete = async () => {
    await handleDelete(blog)
    navigate('/')
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <h2 style={{ marginBottom: 10, fontFamily: 'Roboto' }}>{blog.title}</h2>
      <div style={{ color: '#555', marginBottom: 10 }}>by {blog.author}</div>
      <div style={{ marginBottom: 10 }}><a href={blog.url}>{blog.url}</a></div>
      <div style={{ color: '#555', marginBottom: 10 }}>Added by {blog.user?.name || blog.author}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontWeight: 'bold' }}>{blog.likes} likes</span>
        {loggedUser && (
          <Button variant="outlined" size="small" onClick={() => handleLike(blog)}>like</Button>
        )}
        {isOwner && (
          <Button variant="outlined" color="error" size="small" onClick={onDelete}>remove</Button>
        )}
      </div>
    </Paper>
  )
}

export default BlogView
