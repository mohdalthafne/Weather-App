import { useEffect, useRef, useState } from 'react'
import clear_icon from './assets/clear.png'
import cloud_icon from './assets/cloud.png'
import drizzle_icon from './assets/drizzle.png'
import rain_icon from './assets/rain.png'
import snow_icon from './assets/snow.png'
import mist_icon from './assets/mist.png'
import humidity_icon from './assets/humidity.png'
import wind_icon from './assets/wind.png'

const App = () => {

  useEffect(() => {
    document.title = "Weather App Backend "
  })

  const [userLocation, setUserLocation] = useState({})

  const getUserLocation = () => {
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // what to do once we have the position
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          // display an error if we cant get the users position
          console.error('Error getting user location:', error);
        }
      );

    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }


  // Weather API
  const inputRef = useRef()
  const API_KEY = import.meta.env.VITE_API_KEY
  const [weather, setWeather] = useState({})
  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "50d": mist_icon,
    "50n": mist_icon,
  }
  const search = async (city) => {
    if (city === "") {
      alert("Please enter city name")
      return;
    }
    try {
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&units=metric`
      const res = await fetch(API_URL)
      const data = await res.json()
      const icon = allIcons[data.weather[0].icon] || clear_icon
      setWeather({
        city: data.name,
        country: data.sys.country,
        icon: icon,
        temprature: Math.floor(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
      })
    } catch (error) {
      setWeather(false)
    }
  }
  useEffect(() => {
    search("new york")
  }, [])

  return (
    <section className="weather-box">
      <header>
        <h1>Simplified <span>Weather</span> App</h1>
      </header>
      <div className="location">
        <input type="text" ref={inputRef} placeholder="Type City Name Eg:- New York" />
        <i className="fa-solid fa-magnifying-glass" onClick={() => search(inputRef.current.value)}></i>
      </div>
      {weather ? <>
        <div className="weather">
          <h2>{weather.city}, <span>{weather.country}</span></h2>
          <img src={weather.icon} alt="" className='image' />
          <p className="temp"><span>{weather.temprature}</span>°C</p>
          <p className="desc">{weather.description}</p>
        </div>
        <div className="under">
          <div className="under-box">
            <img src={humidity_icon} alt="" />
            <div><p className='main-txt'>{weather.humidity}%</p>
              <p className='sub-txt'>Humidity</p>
            </div>
          </div>
          <div className="line"></div>
          <div className="under-box">
            <img src={wind_icon} alt="" />
            <div><p className='main-txt'>{weather.windspeed} km/h</p>
              <p className='sub-txt'>Wind Speed</p>
            </div>
          </div>
        </div>
      </> : <></>}
    </section>
  )
}

export default App