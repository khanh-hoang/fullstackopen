import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotificationType(type)
    setNotificationMessage(message)
    setTimeout(() => setNotificationMessage(null), 10000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const exist = persons.find(person => person.name === newName)
    if (exist) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with the new one?`)) {
        const updatedPerson = { ...exist, number: newNumber }
        personService
          .update(exist.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === exist.id ? returnedPerson : p))
            setNewName('')
            setNewNumber('')
            showNotification(`Updated ${newName} number`)
          })
          .catch(error => {
            if (error.response && error.response.data && error.response.data.error) {
              showNotification(error.response.data.error, 'error')
            } else {
              showNotification(`Information of ${exist.name} has already been removed from server`, 'error')
              setPersons(persons.filter(p => p.id !== exist.id))
            }
          })
      }
      return
    }
    const newPerson = { name: newName, number: newNumber }
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${newName}`)
      })
      .catch(error => {
        showNotification(error.response.data.error, 'error')
      })
  }

  const deletePerson = id => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterName.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <Filter filterName={filterName} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App