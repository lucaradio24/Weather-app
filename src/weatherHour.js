export class WeatherHour {
    constructor(hourlyData, hourIndex){
        
        this.hourIndex = hourIndex;
        this.temp = hourlyData.temp;
        this.icon = hourlyData.icon;
        this.hour = hourlyData.datetime;
    }

    formatHour(){
       let formattedHour = parseInt(this.hour.slice(0, 2), 10);

       if (formattedHour == 0) {
        return '12 AM';
        } else if (formattedHour < 12){
            return formattedHour + ' AM'
        } else if (formattedHour == 12){
            return '12 PM'
        } else {
            return (formattedHour - 12 + ' PM');
    } 
}
}