import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from backend', async () => {
    const mockAnecdotes = [
      { id: '1', content: 'test 1', votes: 0 }
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('voting increases the vote count of an anecdote', async () => {
    const anecdote = { id: '1', content: 'test 1', votes: 0 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteService.update.mockResolvedValue({ ...anecdote, votes: 1 })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote('1')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)
  })
})

describe('useAnecdotes', () => {
  it('returns anecdotes sorted by votes in descending order', () => {
    const anecdotes = [
      { id: '1', content: 'test 1', votes: 1 },
      { id: '2', content: 'test 2', votes: 5 },
      { id: '3', content: 'test 3', votes: 3 },
    ]
    useAnecdoteStore.setState({ anecdotes })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current[0].votes).toBe(5)
    expect(result.current[1].votes).toBe(3)
    expect(result.current[2].votes).toBe(1)
  })

  it('returns only anecdotes matching the filter', () => {
    const anecdotes = [
      { id: '1', content: 'test 1', votes: 0 },
      { id: '2', content: 'test 2', votes: 0 },
      { id: '3', content: 'test 3', votes: 0 },
    ]
    useAnecdoteStore.setState({ anecdotes, filter: 'test 2' })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('2')
  })})
