document.getElementById("search_btn").addEventListener("click", function (event) {
    
    const city = document.getElementById("city").value;
    if(city.length<1){
        alert("Please enter a city name");
    }else{
        searchCity(city);
    }
    
  });
  
  function searchCity(city) {
    
    const currentWeather = document.getElementById("current-weather");
    currentWeather.innerHTML = "Loading";
    const apiKey = "7a56cac986d863a5735c46c03bbac459";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if(data.cod=="404"){
            alert("City Not Found, Please try again");
        }else{
        showweather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
        saveToSearchHistory(city);
    }
      });
  }
  
  function saveToSearchHistory(city) {
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!searchHistory.includes(city)) {
        const newSearchHistory = [city];
    const updatedSearchHistory = newSearchHistory.concat(searchHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedSearchHistory));
    }
    previousSearches();
  }
  
  
  function showweather(data) {
    const currentWeather = document.getElementById("current-weather");
    const weather_icon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    currentWeather.innerHTML = `
      <h2 class="current_weather_heading">${data.name} (${new Date().toLocaleDateString()})<img src="${weather_icon}" alt="${data.weather[0].description}"></h2>
      <p>Temperature: ${data.main.temp}K</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
  }
  
  function fetchForecast(lat, lon) {
    const apiKey = "7a56cac986d863a5735c46c03bbac459";
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
      .then((response) => response.json())
      .then((data) => displayForecast(data.list));
  }
  
  function displayForecast(forecastData) {
    const forecast_detail = document.getElementById("detail_forecast");
    let output = `<h1>5-Day Forecast:</h1>`;
    for (let i = 0; i < forecastData.length; i += 8) {
      const weather_icon = `https://openweathermap.org/img/w/${forecastData[i].weather[0].icon}.png`;
      const date = new Date(forecastData[i].dt * 1000).toLocaleDateString();
      output += `
        <div class="card">
          <h3>${date}</h3>
          <img src="${weather_icon}" alt="${forecastData[i].weather[0].description}">
          <p>Temperature: ${forecastData[i].main.temp}K</p>
          <p>Wind Speed: ${forecastData[i].wind.speed} m/s</p>
          <p>Humidity: ${forecastData[i].main.humidity}%</p>
        </div>
      `;
    }
    forecast_detail.innerHTML = output;
  }
  function previousSearches() {
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const searchHistoryDiv = document.getElementById("search-history");
    searchHistoryDiv.innerHTML = "";
  
    searchHistory.forEach((city) => {
      const cityButton = document.createElement("button");
      cityButton.textContent = city;
      cityButton.classList.add("city_btn");
      cityButton.addEventListener("click", () => {
        searchCity(city);
      });
      searchHistoryDiv.appendChild(cityButton);
    });
  }
  previousSearches();
