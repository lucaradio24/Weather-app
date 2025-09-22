import { getApiData } from "./ApiData.js";
import "./style.css";
import { WeatherData } from "./weatherData.js";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

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




export function renderData(weatherData, index) {
  displayCity.textContent = weatherData.city;
  temp.textContent = weatherData.days[index].temp;
  tempMin.textContent = weatherData.days[index].tempMin;
  tempMax.textContent = weatherData.days[index].tempMax;
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

  const filteredHours = weatherData.days[index].getFilteredHours(currentHour);
  renderHourlyCarousel(filteredHours);

  const swiper = new Swiper(".swiper", {
    modules: [Navigation],
    slidesPerView: 8, // Quante card visibili
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    spaceBetween: 10,
    // Altre opzioni Swiper...
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

renderWeekCarousel(weatherData)

};


// Hourly cards
const hourlyCards = document.querySelectorAll(".hourly-card");
const hourText = document.querySelectorAll(".hour-text");
const hourIcon = document.querySelectorAll(".hourly-card-icon");
const hourTemp = document.querySelectorAll(".hourly-card-temp");

// function renderHourlyData(hours){
// hourText.forEach((el, i) => {
//   el.textContent = hours[i]?.formatHour();
// });
// hourIcon.forEach((el, i) => {
//   el.src = `/icons/${hours[i]?.icon}.svg`;
// });
// hourTemp.forEach((el, i) => {
//   el.textContent = hours[i]?.temp;
// });
// }

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
      wrapper.appendChild(slide);
    }
  }
}

