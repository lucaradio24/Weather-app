import { getApiData } from "./ApiData.js";
import { WeatherDay } from "./weatherDay.js";

 export class WeatherData {
    constructor(apiData){
        this.city = apiData.resolvedAddress;
        this.days = apiData.days.map((day, index) => 
            new WeatherDay(day, index)
        )
    }
}

// const apiData = await getApiData('Naples');
// const weatherData = new WeatherData(apiData);

// console.log(weatherData)