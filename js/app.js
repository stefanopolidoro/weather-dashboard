// DOM elements
const searchBtn = document.getElementById('search-btn');

const geoBtn = document.getElementById('geo-btn');

const meteo = document.getElementById('meteo');
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
            meteo.style.display = 'none';
            forecast.innerHTML = '';
            return;
        }

        // Hide error if previously shown
        errorMsg.style.display = 'none';

        // Show weather card
        meteo.style.display = 'block';

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
            card.classList.add('forecast-card');
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

// Get weather by user location
geoBtn.addEventListener('click', () => {
    if(!navigator.geolocation) {
        alert('Geolocalizzazione non supportata dal tuo browser');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            loadWeatherByCoords(lat, lon);
        },
        () => {
            alert('Impossibile ottenere la posizione');
        }
    );
});

// Fetch weather by coordinates
async function loadWeatherByCoords(lat, lon) {
    await getWeatherByCoords(lat, lon);
    await getForecastByCoords(lat, lon);
}

// Fetch weather by coordinates
async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=it`);
        const data = await response.json();

        // Hide error if previously shown
        errorMsg.style.display = 'none';

        // Show weather card
        meteo.style.display = 'block';

        // Update DOM with weather data
        cityName.textContent = data.name;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        temperature.textContent = `${data.main.temp}°C`;
        description.textContent = data.weather[0].description;
        humidity.textContent = `Umidità: ${data.main.humidity}%`;
        wind.textContent = `Vento: ${Math.round(data.wind.speed * 3.6)} km/h`;
        feelsLike.textContent = `Percepita: ${Math.round(data.main.feels_like)}°C`;


    } catch(error) {
        errorMsg.style.display = 'block';
    }
}

// Fetch forecast by coordinates
async function getForecastByCoords(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=it`);
        const data = await response.json();

        // Filter only 12:00 slots
        const daily = data.list.filter(item => item.dt_txt.includes('12:00:00'));

        // Clear previous forecast
        forecast.innerHTML = '';

        daily.forEach(day => {
            const date = new Date(day.dt * 1000).toLocaleDateString('it-IT', {
                weekday: 'short', day: 'numeric', month: 'short'
            });

            const card = document.createElement('div');
            card.classList.add('forecast-card');
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