import './style.css'

const tempData = document.querySelector('.tempData')

async function getData() {
 try{
   const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/naples?unitGroup=metric&key=WFEKF8BG6B9VK87DDDPRJRFEZ'  
  );
  const weatherData = await response.json();

  console.log(weatherData.days[0].temp);

  // tempData.textContent = ;
} catch (error) {
  console.error('Errore mio')
}
}
getData()


// weatherData.