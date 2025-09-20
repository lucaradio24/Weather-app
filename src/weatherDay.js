
export class WeatherDay {
  constructor(dayData, dayIndex) {
    this.dayIndex = dayIndex;
    this.date = dayData.date;
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
  }
}
