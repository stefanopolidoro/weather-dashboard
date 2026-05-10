// fetch(`https://api.openweathermap.org/data/2.5/weather?q=Napoli&appid=${API_KEY}&units=metric&lang=it`)
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => console.error('Errore:', error));

async function getWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Napoli&appid=${API_KEY}&units=metric&lang=it`);
        const data = await response.json();

        // console.log('Città:', data.name);
        // console.log('Temperatura:', data.main.temp);
        // console.log('Descrizione', data.weather[0].description);
        // console.log('Umidità:', data.main.humidity);

        document.getElementById('city-name').textContent = data.name;
        document.getElementById('temperature').textContent = `${data.main.temp}°C`;
        document.getElementById('description').textContent = data.weather[0].description;
    } catch(error) {
        console.error('Errore:', error);
    }
}

getWeather();