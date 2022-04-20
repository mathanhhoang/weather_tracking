import React, { useState, useEffect, useCallback } from "react";
import UseDebounce from "./hook/UseDebounce";
const api = {
  key: "66b56a8624b2b16e74264b1e24354be5",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const Http = new XMLHttpRequest();
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocation = () => {
    var bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        bdcApi =
          bdcApi +
          "?latitude=" +
          position.coords.latitude +
          "&longitude=" +
          position.coords.longitude +
          "&localityLanguage=en";
        getApi(bdcApi);
      },
      (err) => {
        getApi(bdcApi);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };
  const search = useCallback((query) => {
    if(query){
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}&lang=vi`)
      .then((res) => res.json())
      .then((result) => {
        setWeather(result);
      });
    }
    
  }, []);

  const getApi = (bdcApi) => {
    Http.open("GET", bdcApi);
    Http.send();
    Http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var myJson = this.responseText;
        const myObj = JSON.parse(myJson);
        var location = myObj.principalSubdivision;
        setQuery(location);
      }
    };
  };

  const debouncedSearchTerm = UseDebounce(query, 1000);

  useEffect(() => {
    search(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      search(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, search]);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      search();
    },
    [search]
  );

  const dateBuilder = (d) => {
    let months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    let days = [
      "Chủ Nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  return (
    <div
      className={
        typeof weather.main != "undefined"
          ? weather.main.temp > 20
            ? "app warm"
            : "app"
          : "app"
      }
    >
      <main>
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <input
              name="query"
              type="text"
              className="search-bar"
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </form>
        </div>
        {typeof weather.main != "undefined" ? (
          <div>
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)}°c</div>
              <div className="weather">{weather.weather[0].main}</div>
              <div className="description">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}

export default App;
