import './style.css'
import { searchFunction, renderData } from './ui.js'
import { getApiData } from './ApiData.js';
import { WeatherData } from './weatherData.js';

searchFunction()

  const apiData = await getApiData('Naples');
  const weatherData = new WeatherData(apiData);
  renderData(weatherData, 0)


// const tempData = document.querySelector('.tempData')
// const search = document.querySelector('input[type="search"]')
// const searchSubmit = document.querySelector('button[type="submit"]')
// const searchBox = document.querySelector('#search-box')




// // Search function

// searchBox.addEventListener('submit', (e) => {
//   e.preventDefault();
//   getData(search.value)
// })


// // render data 

// const location = document.querySelector('#location');
// const date = document.querySelector('#date');
// const temp = document.querySelector('#temp');
// const tempMin = document.querySelector('#tempmin');
// const tempMax = document.querySelector('#tempmax');
// const icon = document.querySelector('#weather-icon');
// const day = document.querySelector('#day');
// const description = document.querySelector('#description');
// const feelsLike = document.querySelector('#feelslike');
// function renderData (weatherData){
//   icon.src = `/icons/${weatherData.days[0].icon}.png`
//   temp.textContent = `${weatherData.days[0].temp}°`;
//   description.textContent = weatherData.days[0].description;
//   tempMax.textContent = `${weatherData.days[0].tempmax}°`;
//   tempMin.textContent = `${weatherData.days[0].tempmin}°`;
//   feelsLike.textContent = `Feels like ${weatherData.days[0].feelslike}°`;

//   const dateObj = new Date(weatherData.days[0].datetime);
//   const dayOfWeek = dateObj.toLocaleDateString('it-IT', { weekday: 'long'})
//   day.textContent = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)

//   let realFeel = console.log();
//   let conditions = console.log(weatherData.days[0].conditions)
//   let humidity = console.log(weatherData.days[0].humidity);
//   let chanceOfRain = console.log(weatherData.days[0].precipprob);
  
// }