import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import { Container, AppBar, Toolbar, Button } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotificationType(type)
    setNotificationMessage(message)
    setTimeout(() => setNotificationMessage(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat({ ...newBlog, user: { id: user.id, username: user.username, name: user.name } }))
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    } catch {
      showNotification('failed to create blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }
    try {
      const returned = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, likes: returned.likes } : b))
    } catch {
      showNotification('failed to update likes', 'error')
    }
  }

  const handleDelete = async (blog) => {
    if (!window.confirm(`Remove ${blog.title} by ${blog.author}?`)) return
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    } catch {
      showNotification('failed to delete blog', 'error')
    }
  }

  const match = useMatch('/blogs/:id')
  const blogMatch = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <h6 style={{ flexGrow: 1, margin: 0, color: 'white', fontSize: '1.5rem', fontFamily: 'Roboto' }}>Blog App</h6>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>blogs</Button>
          {user && <Button color="inherit" component={Link} to="/create" sx={hoverStyle}>new blog</Button>}
          {user
            ? <>
                <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>logout</Button>
              </>
            : <Button color="inherit" component={Link} to="/login" sx={hoverStyle}>login</Button>
          }
        </Toolbar>
      </AppBar>

      <Notification message={notificationMessage} type={notificationType} />

      <Routes>
        <Route path="/login" element={
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        } />
        <Route path="/" element={
          <><h2>blogs</h2><BlogList blogs={blogs} /></>
        } />
        <Route path="/blogs/:id" element={
          <BlogView blog={blogMatch} handleLike={handleLike} handleDelete={handleDelete} loggedUser={user} />
        } />
        <Route path="/create" element={
          <BlogForm createBlog={handleCreateBlog} />
        } />
      </Routes>
    </Container>
  )
}

export default App