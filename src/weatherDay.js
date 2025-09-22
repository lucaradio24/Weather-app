import { WeatherHour } from "./weatherHour";

export class WeatherDay {
  constructor(dayData, dayIndex) {
    this.dayIndex = dayIndex;
    this.date = dayData.datetime;
    this.temp = dayData.temp;
    this.tempMin = dayData.tempmin;
    this.tempMax = dayData.tempmax;
    this.feelsLike = dayData.feelslike;
    this.icon = dayData.icon;
    this.description = dayData.conditions;
    this.humidity = dayData.humidity;
    this.wind = dayData.windspeed;
    this.gusts = dayData.windgust;
    this.chanceOfRain = dayData.precipprob;
    this.sunrise = dayData.sunrise;
    this.sunset = dayData.sunset;
    this.uvIndex = dayData.uvindex;
    this.pressure = dayData.pressure;
    
    this.hours = dayData.hours.map((hourlyData, hourIndex) => 
    new WeatherHour(hourlyData, hourIndex))
  }

  getFilteredHours(currentHour, minHours = 12){

    const startIndex = this.hours.findIndex(h => parseInt(h.hour.slice(0,2)) === currentHour);
    let filteredHours = this.hours.slice(startIndex + 1)
    
    if(filteredHours.length < minHours){
      const hoursNeeded = minHours - filteredHours.length;
      const previousHours = this.hours.slice(Math.max(0, startIndex - hoursNeeded), startIndex);
      filteredHours = [...previousHours, ...filteredHours];

    }
    return filteredHours;
  }

  getDayName(){
  const date = new Date(this.date);
  return date.toLocaleDateString('it-IT', {weekday: "short"}).toUpperCase()
}

  formatDate(){
    const date = new Date(this.date);
    return date.toLocaleDateString('it-IT', { day: "numeric", month: "short"})
  }

  formatDateLong(){
    const date = new Date(this.date);
    return date.toLocaleDateString('en-EN', { weekday: "long", day: "numeric", month: "long"})
  }
}
