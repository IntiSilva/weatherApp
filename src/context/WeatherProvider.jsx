import { useState, createContext } from 'react'
import axios from 'axios'

const WeatherContext = createContext()

const WeatherProvider = ({children}) => {

    const [search, setSearch] = useState({
        city: '',
        country: ''
    })
    const [result, setResult] = useState({})
    const [loading, setLoading] = useState(false)
    const [noResult, setNoResult] = useState(false)


    const searchData = e => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value
        })
    }

    const checkWeather = async userData => {
        setLoading(true)
        setNoResult(false)
        try {
            const { city, country } = userData

            const appId = import.meta.env.VITE_API_KEY

            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${appId}`

            const { data } = await axios(url)
            const { lat, lon } = data[0]

            const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            const { data: weather } = await axios(urlWeather)
            setResult(weather)

        } catch (error) {
            setNoResult('There is no results')
        } finally {
            setLoading(false)
        }

    }

    return (
        <WeatherContext.Provider
            value={{
                search,
                searchData,
                checkWeather,
                result,
                loading,
                noResult
            }}
        >
            {children}
        </WeatherContext.Provider>
    )
}

export {
    WeatherProvider
}
export default WeatherContext