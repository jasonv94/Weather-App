class ForecastData {
  constructor(temperature,location,description,datetime){
    this.temperature=temperature;
    this.location=location;
    this.description=description;
    this.datetime=datetime;
  };
};



module.exports=ForecastData;
