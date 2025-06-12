const apiKey = '358470b413b889f528a5514d126023d5';

const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const cityInput = document.getElementById('city-input');
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const currentTemp = document.getElementById('current-temp');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const forecastContainer = document.getElementById('forecast-days');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== '') {
        getWeather(city);
        getForecast(city);
    }
});

locationBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoords(latitude, longitude);
            getForecastByCoords(latitude, longitude);
        },
        error => alert('Location access denied or unavailable')
    );
});

function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => updateCurrentWeather(data));
}

function getForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => updateForecast(data));
}

function getWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => updateCurrentWeather(data));
}

function getForecastByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => updateForecast(data));
}

function updateCurrentWeather(data) {
    if (data.cod !== 200) {
        alert('City not found');
        return;
    }

    cityName.textContent = data.name + ', ' + data.sys.country;
    currentDate.textContent = new Date().toLocaleDateString();
    currentTemp.textContent = Math.round(data.main.temp);
    weatherDescription.textContent = data.weather[0].description;
    windSpeed.textContent = data.wind.speed;
    humidity.textContent = data.main.humidity;

    const iconCode = data.weather[0].icon;
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon">`;
}
function updateForecast(data) {
    forecastContainer.innerHTML = '';
    const dailyData = {};
    data.list.forEach(entry => {
        const date = entry.dt_txt.split(' ')[0];
        if (!dailyData[date] && entry.dt_txt.includes('12:00:00')) {
            dailyData[date] = entry;
        }
    });

     Object.keys(dailyData).slice(0, 5).forEach(date => {
        const item = dailyData[date];
        const day = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        const icon = item.weather[0].icon;
        const temp = Math.round(item.main.temp);

        const forecastHTML = `
            <div class="forecast-day">
                <p>${day}</p>
                <div class="forecast-icon"><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon"></div>
                <div class="forecast-temp">
                    <span>${temp}°C</span>
                </div>
            </div>
        `;
        forecastContainer.innerHTML += forecastHTML;
    });
}

