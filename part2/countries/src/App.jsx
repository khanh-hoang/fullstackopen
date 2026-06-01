import { useState, useEffect } from 'react'
import countriesService from './services/countries'

import Filter from './components/Filter'
import Countries from './components/Countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filterName.toLowerCase())
  )

  return (
    <div>
      <Filter filterName={filterName} handleFilterChange={handleFilterChange} />
      <Countries countries={filteredCountries} />
    </div>
  )
}

export default App