const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favorite = blogs[0]
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i]
    }
  }
  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}
  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  }

  let topAuthor = null
  let topCount = 0
  for (const author in counts) {
    if (counts[author] > topCount) {
      topAuthor = author
      topCount = counts[author]
    }
  }

  return { author: topAuthor, blogs: topCount }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesCount = {}
  for (const blog of blogs) {
    likesCount[blog.author] = (likesCount[blog.author] || 0) + blog.likes
  }

  let topAuthor = null
  let topLikes = 0
  for (const author in likesCount) {
    if (likesCount[author] > topLikes) {
      topAuthor = author
      topLikes = likesCount[author]
    }
  }

  return { author: topAuthor, likes: topLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}