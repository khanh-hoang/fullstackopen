import { createContext, useState } from 'react'

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, setNotification] = useState(null)

  const notify = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
