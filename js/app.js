// DOM elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const feelsLike = document.getElementById('feels-like');

// fetch(`https://api.openweathermap.org/data/2.5/weather?q=Napoli&appid=${API_KEY}&units=metric&lang=it`)
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => console.error('Errore:', error));

// Fetch weather data from OpenWeatherMap API
async function getWeather(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=it`);
    const data = await response.json();
    
    cityName.textContent = data.name;
    temperature.textContent = `${data.main.temp}°C`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `Umidità: ${data.main.humidity}%`;
    wind.textContent = `Vento: ${Math.round(data.wind.speed * 3.6)} km/h`;
    feelsLike.textContent = `Percepita: ${Math.round(data.main.feels_like)}°C`;
  } catch (error) {
    console.error('Errore:', error);
  }
}

// Load default city on startup
// getWeather('Bari');

// Search on button click
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  console.log(city);
  if (city) {
    getWeather(city);
  }
});

// Search on Enter key press
cityInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        searchBtn.click();
    }
});