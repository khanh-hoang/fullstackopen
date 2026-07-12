import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,
  actions: {
    setNotification: (message, seconds) => {
      set(() => ({ message }))
      setTimeout(() => set(() => ({ message: null })), seconds * 1000)
    }
  }
}))

export const useNotification = () => useNotificationStore(state => state.message)
export const useNotificationActions = () => useNotificationStore(state => state.actions)
