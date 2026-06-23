const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const blogs = [
    { title: 'Blog 1', author: 'Author 1', url: '', likes: 1 },
    { title: 'Blog 2', author: 'Author 2', url: '', likes: 2 },
    { title: 'Blog 3', author: 'Author 3', url: '', likes: 3 },
  ]

  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 6)
  })
})

describe('favorite blog', () => {
  const blogs = [
    { title: 'Blog 1', author: 'Author 1', url: '', likes: 1 },
    { title: 'Blog 2', author: 'Author 2', url: '', likes: 2 },
    { title: 'Blog 3', author: 'Author 3', url: '', likes: 3 },
  ]

  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('is the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      title: 'Blog 3',
      author: 'Author 3',
      url: '',
      likes: 3,
    })
  })
})

describe('most blogs', () => {
  const blogs = [
    { title: 'Blog 1', author: 'Author 1', url: '', likes: 1 },
    { title: 'Blog 2', author: 'Author 1', url: '', likes: 2 },
    { title: 'Blog 3', author: 'Author 1', url: '', likes: 3 },
    { title: 'Blog 4', author: 'Author 2', url: '', likes: 1 },
    { title: 'Blog 5', author: 'Author 2', url: '', likes: 2 },
    { title: 'Blog 6', author: 'Author 3', url: '', likes: 1 },
  ]

  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('is the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Author 1',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  const blogs = [
    { title: 'Blog 1', author: 'Author 1', url: '', likes: 3 },
    { title: 'Blog 2', author: 'Author 1', url: '', likes: 4 },
    { title: 'Blog 3', author: 'Author 1', url: '', likes: 5 },
    { title: 'Blog 4', author: 'Author 2', url: '', likes: 6 },
    { title: 'Blog 5', author: 'Author 2', url: '', likes: 7 },
    { title: 'Blog 6', author: 'Author 3', url: '', likes: 8 },
  ]

  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('is the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Author 2',
      likes: 13
    })
  })
})