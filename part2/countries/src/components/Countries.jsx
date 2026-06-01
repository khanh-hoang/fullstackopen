import { useState } from 'react'

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital[0]}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} />
    </div>
  )
}

const Countries = ({ countries }) => {
  const [selected, setSelected] = useState(null)

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />
  }

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)}>come back</button>
        <CountryDetail country={selected} />
      </div>
    )
  }

  return (
    <div>
      {countries.map(country =>
        <p key={country.name.common}>
          {country.name.common}
          <button onClick={() => setSelected(country)}>show</button>
        </p>
      )}
    </div>
  )
}

export default Countries
