import { create } from 'zustand'

const useCounterStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    incrementGood:    () => set(state => ({ good:    state.good    + 1 })),
    incrementNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
    incrementBad:     () => set(state => ({ bad:     state.bad     + 1 })),
  }
}))

export const useGood    = () => useCounterStore(state => state.good)
export const useNeutral = () => useCounterStore(state => state.neutral)
export const useBad     = () => useCounterStore(state => state.bad)
export const useCounterControls = () => useCounterStore(state => state.actions)
