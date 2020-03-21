class WeatherData {
  constructor(temperature,descritpion,feels_like,wspeed,humidity){
    this.location=0;
    this.temperature=temperature;
    this.description=descritpion;
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
  //
  // var currentWeather={
  //     location:weatherData.name,
  //     temperature:weatherData.main.temp,
  //     description:weatherData.weather[0].main,
  //     feels_like:weatherData.main.feels_like,
  //     wspeed:weatherData.wind.speed,
  //     humidity:weatherData.main.humidity,
  //     icon:"http://openweathermap.org/img/wn/"+weatherData.weather[0].id+"@2x.png"
  //
  //   }
  //
  //
  //   constructor(name, level) {
  //       this.name = name;
  //       this.level = level;
  //   }
  //    wordUp(req,res){
  //     return 33;
//   //   }
// }
//
// class Rero {
//     constructor(name, level) {
//         this.name = name;
//         this.level = level;
//     }
//      wordUp(req,res){
//       return 33;
//     }
// }
//
var next=new WeatherData(5,6,7,8,9,10)
console.log(next.location)
next.setLocation(30);
console.log(next.location)
var ono=next.getLocation();
console.log(ono)
// module.exports=Hero;
// module.exports=Rero;
// var hero=new Hero('john',22);
// var yo=hero.wordUp()
// console.log(yo)
