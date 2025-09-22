import { getApiData } from "./ApiData.js";
import "./style.css";
import { WeatherData } from "./weatherData.js";

// Search
const searchBox = document.querySelector("#search-box");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

// View principale
const weatherIcon = document.querySelector("#weather-icon");
const displayCity = document.querySelector('#city')
const temp = document.querySelector("#temp");
const description = document.querySelector("#description");
const tempMin = document.querySelector("#tempmin");
const tempMax = document.querySelector("#tempmax");
const feelsLike = document.querySelector("#feelslike");

// Weather details cards
const chanceOfRain = document.querySelector("#chance-of-rain");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");
const uvIndex = document.querySelector("#uv-index");
const pressure = document.querySelector("#pressure");
const gusts = document.querySelector("#gusts");



// Week cards
const weekCards = document.querySelectorAll(".week-card");

export function searchFunction(){

 searchBox.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = searchInput.value;
  const apiData = await getApiData(city);
  const weatherData = new WeatherData(apiData);
  renderData(weatherData, 0)
})
}

export function renderData(weatherData, index){
    displayCity.textContent = weatherData.city;
    temp.textContent = weatherData.days[index].temp;
    tempMin.textContent = weatherData.days[index].tempMin;
    tempMax.textContent = weatherData.days[index].tempMax;
    feelsLike.textContent = `Feels like ${weatherData.days[index].feelsLike}°`
    chanceOfRain.textContent = weatherData.days[index].chanceOfRain + '%';
    humidity.textContent = weatherData.days[index].humidity + '%';
    wind.textContent = weatherData.days[index].wind + 'km/h';
    sunrise.textContent = weatherData.days[index].sunrise; 
    sunset.textContent = weatherData.days[index].sunset; 
    uvIndex.textContent = weatherData.days[index].uvIndex;
    pressure.textContent = weatherData.days[index].pressure + 'mB';
    gusts.textContent = weatherData.days[index].gusts + 'km/h';
    weatherIcon.src = `/icons/${weatherData.days[index].icon}.svg`;

    const currentHour = new Date().getHours();
    
    const filteredHours = weatherData.days[index].getFilteredHours(currentHour);
    renderHourlyData(filteredHours)

}

// Hourly cards
const hourlyCards = document.querySelectorAll(".hourly-card");
const hourText = document.querySelectorAll('.hour-text');
const hourIcon = document.querySelectorAll('.hourly-card-icon');
const hourTemp = document.querySelectorAll('.hourly-card-temp');

function renderHourlyData(hours){
hourText.forEach((el, i) => {
  el.textContent = hours[i]?.formatHour();
});
hourIcon.forEach((el, i) => {
  el.src = `/icons/${hours[i]?.icon}.svg`;
});
hourTemp.forEach((el, i) => {
  el.textContent = hours[i]?.temp;
});
}