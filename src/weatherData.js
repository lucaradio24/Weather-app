import { getApiData } from "./ApiData.js";
import { WeatherDay } from "./weatherDay.js";

 export class WeatherData {
    constructor(apiData){
        this.city = apiData.resolvedAddress;
        this.days = apiData.days.map((dayData, index) => 
            new WeatherDay(dayData, index)
        )
    }
}

// const apiData = await getApiData('Naples');
// const weatherData = new WeatherData(apiData);

// console.log(weatherData)