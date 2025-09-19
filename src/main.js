import './style.css'

const tempData = document.querySelector('.tempData')
const search = document.querySelector('input[type="search"]')
const searchSubmit = document.querySelector('button[type="submit"]')
const searchBox = document.querySelector('#search-box')


// Get data from API
async function getData(city) {
 try{
   const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=WFEKF8BG6B9VK87DDDPRJRFEZ`  
  );
  const weatherData = await response.json();

  renderData(weatherData)
  
} catch (error) {
  console.error('Errore mio')
}
}

// Search function

searchBox.addEventListener('submit', (e) => {
  e.preventDefault();
  getData(search.value)
})


// render data 

const location = document.querySelector('#location');
const date = document.querySelector('#date');
const temp = document.querySelector('#temp');
const tempMin = document.querySelector('#tempmin');
const tempMax = document.querySelector('#tempmax');
const icon = document.querySelector('#weather-icon');
const day = document.querySelector('#day');
const description = document.querySelector('#description');
const feelsLike = document.querySelector('#feelslike');
function renderData (weatherData){
  icon.src = `/icons/${weatherData.days[0].icon}.png`
  temp.textContent = `${weatherData.days[0].temp}°`;
  description.textContent = weatherData.days[0].description;
  tempMax.textContent = `${weatherData.days[0].tempmax}°`;
  tempMin.textContent = `${weatherData.days[0].tempmin}°`;
  feelsLike.textContent = `Feels like ${weatherData.days[0].feelslike}°`;

  const dateObj = new Date(weatherData.days[0].datetime);
  const dayOfWeek = dateObj.toLocaleDateString('it-IT', { weekday: 'long'})
  day.textContent = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)

  let realFeel = console.log();
  let conditions = console.log(weatherData.days[0].conditions)
  let humidity = console.log(weatherData.days[0].humidity);
  let chanceOfRain = console.log(weatherData.days[0].precipprob);
  
}

