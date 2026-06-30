import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onSubmit}>
        <TextField fullWidth sx={{ mb: 2 }} label="title" value={title} onChange={({ target }) => setTitle(target.value)} />
        <TextField fullWidth sx={{ mb: 2 }} label="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        <TextField fullWidth sx={{ mb: 2 }} label="url" value={url} onChange={({ target }) => setUrl(target.value)} />
        <Button type="submit" variant="contained">create</Button>
      </form>
    </div>
  )
}

export default BlogForm
