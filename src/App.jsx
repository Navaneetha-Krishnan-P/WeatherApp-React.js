import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import "./App.css";

// Images
import searchIcon from "./assets/search.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import humidityIcon from "./assets/humidity.png";
import rainIcon from "./assets/rain.png";
import snowIcon from "./assets/snow.png";
import sunIcon from "./assets/sun.png";
import windIcon from "./assets/wind.png";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt={`Weather icon representing ${city}`} />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude </span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">Longitude </span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} km/hr</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
};

function App() {
  let api_key = "71c736d5979c46a95a98d5393431abe4";
  const [text, setText] = useState("Chennai");
  const [icon, setIcon] = useState(sunIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error,setError]=useState(null)

  const weatherIconMap = {
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      setLoading(true);
      // data will be in readable stream we should have to convert that into json
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data)
      if (data.cod === "404") {
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || sunIcon);
    } catch (error) {
      console.log("An error occurred", error.message);
      // setError("An error occurred while fetching the weather data.")
      setCityNotFound(true);
    } finally {
      setLoading(false);
    }
    setCityNotFound(false);
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    // console.log(e.key)
    if (e.key === "Enter") {
      search();
    }
  };

  // after function that array is dependency array
  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            value={text}
            placeholder="Search city"
            onChange={handleCity}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={() => search()} aria-label="Search button">
            <img src={searchIcon} alt="Search icon" />
          </div>
        </div>

        {!loading && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}

        {loading && <div className="loading-message">Loading...</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

        <p className="copyright">
          Designed by <span> - Krishna Nk</span>
        </p>
      </div>
    </>
  );
}

export default App;

