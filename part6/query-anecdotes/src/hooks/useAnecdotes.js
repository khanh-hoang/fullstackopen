import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'
import useNotify from './useNotify'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`you created '${newAnecdote.content}'`)
    },
    onError: () => {
      notify('too short anecdote, must have length 5 or more')
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${updatedAnecdote.content}' voted`)
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => newAnecdoteMutation.mutate({ content, votes: 0 }),
    voteAnecdote: (anecdote) => updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
  }
}
