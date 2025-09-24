import { getApiData } from "./ApiData.js";
import "./style.css";
import { WeatherData } from "./weatherData.js";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { getCitySuggestions } from "./weatherAPI.js";
import { getCityNameFromCoords } from "./weatherAPI.js";

let currentWeatherData = null;
let weekSwiperInstance = null;
let hourlySwiperInstance = null;

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
const displayDate = document.querySelector("#display-date");
const backToTodayBtn = document.querySelector("#today");

let isDarkMode = false;
const toggleColorsModeBtn = document.querySelector("#toggle-colors-mode");

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

searchInput.addEventListener("input", async (e) => {
  const query = e.target.value;
  if (query.length < 2) return;
});

export async function getUserLocation() {
  if (!navigator.geolocation) {
    throw new Error("Geolocalizzazione non supportata dal browser");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 300000 }
    );
  });
}

export async function initializeApp() {
  showLoading();
  searchInput.value = "Finding your location...";
  try {
    const position = await getUserLocation();
    const cityName = await getCityNameFromCoords(position.lat, position.lon);
    const apiData = await getApiData(position);
    const weatherData = new WeatherData(apiData);
    searchInput.value = cityName || weatherData.city;
    renderData(weatherData, 0);
    setTimeout(() => hideLoading(), 1000);
  } catch (error) {
    console.warn("Geolocalizzazione fallita", error.message);
    searchInput.value =
      "We couldn't find your location right now. Showing weather for Rome.";
    const apiData = await getApiData("Rome");
    const weatherData = new WeatherData(apiData);
    searchInput.value = weatherData.city;
    renderData(weatherData, 0);
    setTimeout(() => hideLoading(), 2000);
  }

}

export function renderData(weatherData, index) {
  currentWeatherData = weatherData;
  displayDate.textContent = weatherData.days[index].formatDateLong();
  temp.textContent = weatherData.days[index].temp + "°";
  tempMin.textContent = weatherData.days[index].tempMin + "°";
  tempMax.textContent = weatherData.days[index].tempMax + "°";
  feelsLike.textContent = `Feels like ${weatherData.days[index].feelsLike}°`;
  chanceOfRain.textContent = weatherData.days[index].chanceOfRain + "%";
  humidity.textContent = weatherData.days[index].humidity + "%";
  wind.textContent = weatherData.days[index].wind + " km/h";
  sunrise.textContent = weatherData.days[index].sunrise.slice(0, -3);
  sunset.textContent = weatherData.days[index].sunset.slice(0, -3);
  uvIndex.textContent = weatherData.days[index].uvIndex;
  pressure.textContent = weatherData.days[index].pressure + " mB";
  gusts.textContent = weatherData.days[index].gusts + " km/h";
  weatherIcon.src = `/icons/${weatherData.days[index].icon}.svg`;

  description.textContent = weatherData.days[index].description.split(",")[0];

  const currentHour = new Date().getHours();

  const filteredHours = weatherData.days[index].getFilteredHours(
    currentHour,
    12
  );

  renderHourlyCarousel(filteredHours);
  renderWeekCarousel(weatherData, index);

  if (hourlySwiperInstance) hourlySwiperInstance.destroy();
  hourlySwiperInstance = new Swiper(".hourly-swiper", {
    modules: [Navigation],
    slidesPerView: 6, // Quante card visibili
    navigation: {
      nextEl: ".hourly-next",
      prevEl: ".hourly-prev",
    },
    spaceBetween: 10,
  });

  if (weekSwiperInstance) weekSwiperInstance.destroy();
  weekSwiperInstance = new Swiper(".week-swiper", {
    modules: [Navigation],
    slidesPerView: 4,
    slidesPerGroup: 3, // Quante card visibili
    navigation: {
      nextEl: ".week-next",
      prevEl: ".week-prev",
    },
    spaceBetween: 10,
  });

  weekSwiperInstance.slideTo(Math.max(0, index - 1));
  weekSwiperInstance.update();
}

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

function renderWeekCarousel(weatherData, activeIndex) {
  const wrapper = document.getElementById("week-swiper-wrapper");
  wrapper.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    if (weatherData.days[i]) {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <div class="week-card">
          <img class="week-card-icon" src="/icons/${
            weatherData.days[i].icon
          }.svg" />
          <div class="week-details-container">
            <div class="date">
              <p class="day-name">${weatherData.days[i].getDayName()}</p>
              <p class="date">${weatherData.days[i].formatDate()}</p>
            </div>
            <div class="temp-details">${weatherData.days[i].temp}°</div>
          </div>
        </div>
      `;
      if (i === activeIndex) {
        slide.querySelector(".week-card").classList.add("active");
      }

      slide.addEventListener("click", (e) => {
        renderData(weatherData, i);
        showTodayBtn();
      });

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
  let c = document.getElementById("search-suggestions");
  if (!c) {
    c = document.createElement("div");
    c.id = "search-suggestions";
    c.className = "suggestions";
    searchBox.appendChild(c);
  }
  return c;
}

function renderSuggestions(items) {
  const container = createSuggestionContainer();
  container.style.display = "";
  container.innerHTML = items
    .map(
      (it) =>
        `<div class="suggestion" data-name="${it.name}" data-lat="${
          it.lat
        }" data-lon="${it.lon}">
      <h3 class='city-name'>${it.name}</h3>
      <p class='region light-text'>${it.region ? it.region + ", " : ""}${
          it.country ? it.country : ""
        }
    </p>
      </div>`
    )
    .join("");
  container.querySelectorAll(".suggestion").forEach((el) =>
    el.addEventListener("click", async () => {
      const lat = parseFloat(el.dataset.lat);
      const lon = parseFloat(el.dataset.lon);

      const cityName = el.querySelector(".city-name").textContent;
      const regionName = el.querySelector(".region").textContent;
      const truncatedRegion = regionName.split(",")[0];

      searchInput.value = `${cityName}, ${truncatedRegion}`;

      const apiData = await getApiData({ lat, lon });
      const weatherData = new WeatherData(apiData);
      renderData(weatherData, 0);
      container.innerHTML = "";
      container.style.display = "none";
    })
  );

  if (searchInput.value == "") container.style.display = "none";

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) container.style.display = "none";
  });

}

const debouncedSuggest = debounce(async (q) => {
  const items = await getCitySuggestions(q);
  renderSuggestions(items);
}, 300);

searchInput.addEventListener("input", (e) =>
  debouncedSuggest(e.target.value.trim())
);

const loading = document.getElementById("loading");
const mainContent = document.getElementById("main-content");

function showLoading() {
  loading.style.display = "block";
  mainContent.style.display = 'none';
}

function hideLoading() {
  mainContent.style.display = 'block';
  loading.style.display = 'none';
}

// Theme helpers

function toggleColorsMode() {
  const root = document.documentElement;

  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    root.style.setProperty("--background-color", "#1B1E20");
    root.style.setProperty("--text-color", "#fafafa");
    root.style.setProperty("--card-bg", "#212526");
    root.style.setProperty("--muted-text", "#948D84");
    root.style.setProperty("--hover-color", "#3498db6c");
    root.style.setProperty("--logo-text", "#B0C5D6");
    root.style.setProperty("--dropdown-bg", "rgba(36, 39, 40, 0.9)");
    toggleColorsModeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" 
         height="32px"
         viewBox="0 -960 960 960"
         width="32px"
         fill="#757575">
           <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/>
           </svg>`;
  } else {
    root.style.setProperty("--background-color", "#ffffff");
    root.style.setProperty("--text-color", "#202020ff");
    root.style.setProperty("--card-bg", "#B4CFF75E");
    root.style.setProperty("--muted-text", "#666666");
    root.style.setProperty("--hover-color", "#3498db86");
    root.style.setProperty("--logo-text", "#2c3e50");
    root.style.setProperty("--dropdown-bg", "rgba(225, 235, 250, 0.9)");

    toggleColorsModeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
      height="32px"
      viewBox="0 -960 960 960"
      width="32px"
      fill="#757575">
      <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
      </svg>`;
  }
}

toggleColorsModeBtn.addEventListener("click", () => {
  toggleColorsMode();
});

// Back to today helper

function backToToday() {

  if (currentWeatherData) {
    // Aggiorna la visualizzazione per il giorno 0 senza ricreare i swiper
    const index = 0;
    displayDate.textContent = currentWeatherData.days[index].formatDateLong();
    temp.textContent = currentWeatherData.days[index].temp + "°";
    tempMin.textContent = currentWeatherData.days[index].tempMin + "°";
    tempMax.textContent = currentWeatherData.days[index].tempMax + "°";
    feelsLike.textContent = `Feels like ${currentWeatherData.days[index].feelsLike}°`;
    chanceOfRain.textContent =
      currentWeatherData.days[index].chanceOfRain + "%";
    humidity.textContent = currentWeatherData.days[index].humidity + "%";
    wind.textContent = currentWeatherData.days[index].wind + " km/h";
    sunrise.textContent = currentWeatherData.days[index].sunrise.slice(0, -3);
    sunset.textContent = currentWeatherData.days[index].sunset.slice(0, -3);
    uvIndex.textContent = currentWeatherData.days[index].uvIndex;
    pressure.textContent = currentWeatherData.days[index].pressure + " mB";
    gusts.textContent = currentWeatherData.days[index].gusts + " km/h";
    weatherIcon.src = `/icons/${currentWeatherData.days[index].icon}.svg`;
    description.textContent =
      currentWeatherData.days[index].description.split(",")[0];

    const currentHour = new Date().getHours();
    const filteredHours = currentWeatherData.days[index].getFilteredHours(
      currentHour,
      12
    );
    renderHourlyCarousel(filteredHours);
    renderWeekCarousel(currentWeatherData, index);

    if (hourlySwiperInstance) hourlySwiperInstance.update();
    if (weekSwiperInstance) {
      weekSwiperInstance.update();
      weekSwiperInstance.slideTo(0);
    }

  }
}

function showTodayBtn() {
  backToTodayBtn.style.display = "block";
}

function hideTodayBtn() {
  backToTodayBtn.style.display = "none";
}
backToTodayBtn.addEventListener("click", () => {
  backToToday();
  hideTodayBtn();
});
