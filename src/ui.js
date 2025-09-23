import { getApiData } from "./ApiData.js";
import "./style.css";
import { WeatherData } from "./weatherData.js";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { getCitySuggestions } from "./weatherAPI.js";
import { getCityNameFromCoords } from "./weatherAPI.js";

// Search
const searchBox = document.querySelector("#search-box");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

// View principale
const weatherIcon = document.querySelector("#weather-icon");
const displayCity = document.querySelector("#city");
const temp = document.querySelector("#temp");
const description = document.querySelector("#description");
const tempMin = document.querySelector("#tempmin");
const tempMax = document.querySelector("#tempmax");
const feelsLike = document.querySelector("#feelslike");
const displayDate = document.querySelector('#display-date')

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


export function searchFunction() {
  searchBox.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = searchInput.value;
    const apiData = await getApiData(city);
    const weatherData = new WeatherData(apiData);
    renderData(weatherData, 0);
  });
}

searchInput.addEventListener('input', async (e) => {
const query = e.target.value;
if (query.length < 2) return;

})


export async function getUserLocation(){
  if (!navigator.geolocation){
     throw new Error('Geolocalizzazione non supportata dal browser')
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 300000
      }
    )
  })
}

export async function initializeApp() {
  showLoading()
  searchInput.value = 'Finding your location...'
  try {
    const position = await getUserLocation();
    const cityName = await getCityNameFromCoords(position.lat, position.lon);
    const apiData = await getApiData(position)
    const weatherData = new WeatherData(apiData)
    searchInput.value = cityName || weatherData.city;
    renderData(weatherData, 0)
    hideLoading()
  } catch (error) {
    console.warn('Geolocalizzazione fallita', error.message)
    const apiData = await getApiData('Rome');
    const weatherData = new WeatherData(apiData)
    searchInput.value = weatherData.city;
    renderData(weatherData, 0)
    hideLoading()
    
  }
}

export function renderData(weatherData, index) {
  displayDate.textContent = weatherData.days[index].formatDateLong()
  temp.textContent = weatherData.days[index].temp + '°';
  tempMin.textContent = weatherData.days[index].tempMin + '°';
  tempMax.textContent = weatherData.days[index].tempMax + '°';
  feelsLike.textContent = `Feels like ${weatherData.days[index].feelsLike}°`;
  chanceOfRain.textContent = weatherData.days[index].chanceOfRain + "%";
  humidity.textContent = weatherData.days[index].humidity + "%";
  wind.textContent = weatherData.days[index].wind + "km/h";
  sunrise.textContent = weatherData.days[index].sunrise;
  sunset.textContent = weatherData.days[index].sunset;
  uvIndex.textContent = weatherData.days[index].uvIndex;
  pressure.textContent = weatherData.days[index].pressure + "mB";
  gusts.textContent = weatherData.days[index].gusts + "km/h";
  weatherIcon.src = `/icons/${weatherData.days[index].icon}.svg`;

  const currentHour = new Date().getHours();

  const filteredHours = weatherData.days[index].getFilteredHours(currentHour, 12);
  

  

  renderHourlyCarousel(filteredHours);
  renderWeekCarousel(weatherData);

  const hourlySwiper = new Swiper(".hourly-swiper", {
    modules: [Navigation],
    slidesPerView: 6, // Quante card visibili
    navigation: {
      nextEl: ".hourly-next",
      prevEl: ".hourly-prev",
    },
    spaceBetween: 10,
    
  });

    const weekSwiper = new Swiper('.week-swiper', {
    modules: [Navigation],
    slidesPerView: 4, // Quante card visibili
    navigation: {
      nextEl: '.week-next',
      prevEl: '.week-prev',
    },
    spaceBetween: 10,
  });

};


// Hourly cards
const hourlyCards = document.querySelectorAll(".hourly-card");
const hourText = document.querySelectorAll(".hour-text");
const hourIcon = document.querySelectorAll(".hourly-card-icon");
const hourTemp = document.querySelectorAll(".hourly-card-temp");



function renderHourlyCarousel(hours) {
  const wrapper = document.getElementById("hourly-swiper-wrapper");
  wrapper.innerHTML = ""; // Svuota il container

  hours.forEach((hour) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="hourly-card">
        <span class="hour-text">${hour.formatHour()}</span>
        <img class="hourly-card-icon" src="/icons/${hour.icon}.svg" />
        <span class="hourly-card-temp">${hour.temp}°</span>
      </div>
    `;
    wrapper.appendChild(slide);
  });
}


// function renderWeekData(weatherData){
  
//   const weekContainer = document.querySelector('.week-cards-container');
//   weekContainer.innerHTML = '';
//   let html = '';
//   for(let i = 1; i < 8; i++ ){
//     html += 
//     ` <div class="week-cards-container">
//           <div class="week-card">
//             <img class="week-card-icon" src="/icons/${weatherData.days[i].icon}.svg" />
//             <div class="week-details-container">
//               <div class="date">
//                 <p class="day-name">${weatherData.days[i].getDayName()}</p>
//                 <p class="date">${weatherData.days[i].formatDate()}</p>
//               </div>
//               <div class="temp-details">${weatherData.days[i].temp}°</div>
//             </div>
//           </div>`
//         }
//           weekContainer.innerHTML = html

    // weekCards[i].querySelector('.day-name').textContent = 'TUE';
    // weekCards[i].querySelector('.date').textContent = `${weatherData.days[i].date}`;
    // weekCards[i].querySelector('.week-card-icon').src = `/icons/${weatherData.days[i].icon}.svg`;
    // weekCards[i].querySelector('.temp-details').textContent = `${weatherData.days[i].temp}°`
// }

function renderWeekCarousel(weatherData) {
  const wrapper = document.getElementById("week-swiper-wrapper");
  wrapper.innerHTML = "";
  for (let i = 1; i < 8; i++) {
    if (weatherData.days[i]) {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <div class="week-card">
          <img class="week-card-icon" src="/icons/${weatherData.days[i].icon}.svg" />
          <div class="week-details-container">
            <div class="date">
              <p class="day-name">${weatherData.days[i].getDayName()}</p>
              <p class="date">${weatherData.days[i].formatDate()}</p>
            </div>
            <div class="temp-details">${weatherData.days[i].temp}°</div>
          </div>
        </div>
      `;

      slide.addEventListener('click', (e) => {
        renderData(weatherData, i)
        
      })

      wrapper.appendChild(slide);
    }
  }
}


function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function createSuggestionContainer() {
  let c = document.getElementById('search-suggestions');
  if (!c) {
    c = document.createElement('div');
    c.id = 'search-suggestions';
    c.className = 'suggestions';
    searchBox.appendChild(c);
  }
  return c;
}

function renderSuggestions(items) {
  const container = createSuggestionContainer();
  container.style.display = '';
  container.innerHTML = items.map(it =>
    `<div class="suggestion" data-name="${it.name}" data-lat="${it.lat}" data-lon="${it.lon}">
      <h3 class='city-name'>${it.name}</h3>
      <p class='region light-text'>${it.region ? it.region + ', ' : ''}${it.country ? it.country : ''}
    </p>
      </div>`
  ).join('');
  container.querySelectorAll('.suggestion').forEach(el =>
    el.addEventListener('click', async () => {
      const lat = parseFloat(el.dataset.lat);
      const lon = parseFloat(el.dataset.lon);

      const cityName = el.querySelector('.city-name').textContent;
      const regionName = el.querySelector('.region').textContent;
      const truncatedRegion = regionName.split(',')[0];
     
      searchInput.value = `${cityName}, ${truncatedRegion}`
    
      const apiData = await getApiData({lat, lon});
      const weatherData = new WeatherData(apiData);
      renderData(weatherData, 0);
      container.innerHTML = '';
      container.style.display = 'none'
    })
  );

  if (searchInput.value == '') container.style.display = 'none'

  document.addEventListener('click', (e) => {
    if(!container.contains(e.target)) container.style.display = 'none'
  })
}

const debouncedSuggest = debounce(async (q) => {
  const items = await getCitySuggestions(q);
  renderSuggestions(items);
}, 300);

searchInput.addEventListener('input', (e) => debouncedSuggest(e.target.value.trim()));


const loading = document.getElementById('loading');
const mainContent = document.getElementById('main-content');

function showLoading(){
  loading.style.display = 'block';
  mainContent.style.display = 'none';
}

function hideLoading(){
  loading.style.display = 'none'
  mainContent.style.display = 'block'
}