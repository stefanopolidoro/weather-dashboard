// DOM elements
const searchBtn = document.getElementById('search-btn');

const cityInput = document.getElementById('city-input');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const feelsLike = document.getElementById('feels-like');

const weatherIcon = document.getElementById('weather-icon');

const forecast = document.getElementById('forecast');

const errorMsg = document.getElementById('error-msg');

// Fetch weather data from OpenWeatherMap API
async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=it`);
        const data = await response.json();
        
        // If city not found
        if(data.cod === '404') {
            errorMsg.style.display = 'block';
            return;
        }

        // Hide error if previously shown
        errorMsg.style.display = 'none';

        // Update DOM with weather data
        cityName.textContent = data.name;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        temperature.textContent = `${data.main.temp}°C`;
        description.textContent = data.weather[0].description;
        humidity.textContent = `Umidità: ${data.main.humidity}%`;
        wind.textContent = `Vento: ${Math.round(data.wind.speed * 3.6)} km/h`;
        feelsLike.textContent = `Percepita: ${Math.round(data.main.feels_like)}°C`;
    } catch (error) {
        errorMsg.style.display = 'block';
    }
}

// Load default city on startup
async function loadWeather(city) {
    await getWeather(city);
    await getForecast(city);
}

// Search on button click
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        loadWeather(city);
    }
});

// Search on Enter key press
cityInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        searchBtn.click();
    }
});

// Fetch 5-day forecast
async function getForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=it`);
        const data = await response.json();

        // Filter only 12.00 slots
        const daily = data.list.filter(item => item.dt_txt.includes('12:00:00'));

        // Clear previous forecast
        forecast.innerHTML = '';

        daily.forEach(day => {
            const date = new Date(day.dt * 1000).toLocaleDateString('it-IT', {
                weekday: 'short', day: 'numeric', month: 'short'
            });

            const card = document.createElement('div');
            card.innerHTML = `
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" />
                <p>${Math.round(day.main.temp)}°C</p>
                <p>${day.weather[0].description}</p>
            `;
            
            forecast.appendChild(card);
        });

    } catch (error) {
        errorMsg.style.display = 'block';
    }
}