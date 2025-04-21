import { useState, useEffect } from "react";
import "./App.css";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Images
import clear from "./assets/clear.png";
import cloud from "./assets/cloud.png";
import drizzle from "./assets/drizzle.png";
import humidityImg from "./assets/humidity.png";
import rain from "./assets/rain.png";
import snow from "./assets/snow.png";
import windImg from "./assets/wind.png";

const WeatherApp = (props) => {
  return (
    <div className="weather-container">
      <main>
        <img src={props.weather} alt="weather-icon" height="130vh" />
      </main>
      <p>
        <span>{props.measure}&#176;C</span>
      </p>
      <h3>{props.city}</h3>
      <div className="country">{props.country}</div>
      <div className="coord">
        <div>
          <span>Latitude</span>
          <span>{props.lat}</span>
        </div>
        <div>
          <span>Longitude</span>
          <span>{props.long}</span>
        </div>
      </div>
      <div className="atmosphere">
        <div className="humidity">
          <img src={humidityImg} alt="humidity" />
          <h4>{props.humid}%</h4>
          <span>Humidity</span>
        </div>
        <div className="wind-speed">
          <img src={windImg} alt="wind" />
          <h4>{props.win} km/h</h4>
          <span>Wind Speed</span>
        </div>
      </div>
      <div className="end">
        Designed By{" "}
        <span style={{ color: "#6D214F", fontWeight: "bold" }}>Avinash</span>
      </div>
    </div>
  );
};

function App() {
  const [weather, setWeather] = useState(snow);
  const [measure, setMeasure] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humid, setHumid] = useState(0);
  const [win, setWin] = useState(0);
  const [search, setSearch] = useState("");

  const apiKey = import.meta.env.VITE_API_KEY;

  const fetchWeather = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        // Replace default alert with SweetAlert2
        Swal.fire({
          icon: "error",
          title: "City not found",
          text: "Please try again!",
        });
        setSearch("");
        return;
      }

      setCity(data.name);
      setCountry(data.sys.country);
      setMeasure(data.main.temp);
      setLat(data.coord.lat.toFixed(2));
      setLong(data.coord.lon.toFixed(2));
      setHumid(data.main.humidity);
      setWin(data.wind.speed);

      switch (data.weather[0].main) {
        case "Clear":
          setWeather(clear);
          break;
        case "Clouds":
          setWeather(cloud);
          break;
        case "Rain":
          setWeather(rain);
          break;
        case "Drizzle":
          setWeather(drizzle);
          break;
        case "Snow":
          setWeather(snow);
          break;
        default:
          setWeather(clear);
      }

      setSearch("");
    } catch (error) {
      // Replace default alert with SweetAlert2
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Try again...",
      });
    }
  };

  const weatherSearch = () => {
    if (!search) {
      Swal.fire({
        icon: "warning",
        title: "Please enter a city name",
        text: "Search field cannot be empty!",
      });
      return;
    }
    fetchWeather(search);
  };

  // 🔁 Auto-fetch Bangalore weather on first load
  useEffect(() => {
    fetchWeather("Bangalore");
  }, []);

  return (
    <>
      <div className="app-container">
        <header>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={weatherSearch}>Search</button>
        </header>
        <WeatherApp
          weather={weather}
          wind={windImg}
          humidity={humidityImg}
          measure={measure}
          city={city}
          country={country}
          lat={lat}
          long={long}
          humid={humid}
          win={win}
        />
      </div>
    </>
  );
}

export default App;

WeatherApp.propTypes = {
  weather: PropTypes.string.isRequired,
  measure: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  long: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  humid: PropTypes.number.isRequired,
  win: PropTypes.number.isRequired,
  humidity: PropTypes.string.isRequired,
  wind: PropTypes.string.isRequired,
};
