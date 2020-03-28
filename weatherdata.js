class WeatherData {
  constructor(location,temperature,description,feels_like,wspeed=0,humidity=0){
    this.location=location;
    this.temperature=temperature;
    this.description=description;
    this.feels_like=feels_like;
    this.wspeed=wspeed;
    this.humidity=humidity;
  };
  setLocation(value){
    this.location=value;
  }
  getLocation(){
    return this.location;
  }
};
module.exports=WeatherData;
