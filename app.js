//express,bodyParser,https requires assigned libraries for interaciton between js and html(ejs) pages
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const WeatherData = require("./weatherdata.js") ////WeatherData class
const ForecastData= require("./forecastdata.js")//class for the forecast
const app = express();
//mongoose db connection
const mongoose = require('mongoose');


//mongoose connection user info and pass blocked out
// "mongodb://localhost:27017/locationsDB"
mongoose.connect("mongodb+srv://jasonv94:trigger44@cluster0-rpz2t.gcp.mongodb.net/locationsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//db schema
const locationSchema = {
  city: String,
  temp: String
};
const Location = mongoose.model("Location", locationSchema);//MongoDB setup
var defaultLocation = ["Abbotsford"];
var dayholder = [];
var weatherIcons = [] //use to hold the icons we will need to change
var j = 0;//index for the 4 day forecast
var mapView = ["temp_new"];//default for map view
const unit = ["metric"];//default units metric
app.set('view engine', 'ejs');
// app.use is used to access the HTML elements



var today = new Date();
var options = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year:"numeric"

};
const currentDate = today.toLocaleDateString("en-US", options);
//////////////////////////////date info
///////////////////////////////info for query
units = "metric";
key = "9ea0171656c27a5884112d1c503edab8";//free api key at openweathermap.org
//////////info for query

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//getWeather function used to get current weathermap
app.get("/", function getWeather(req, res) {

  query = defaultLocation[0];

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + key + "&units=" + unit[0] + "";
  https.get(url, function (response) {
    response.on("data", function(data) {
      console.log(req.body.deg);
      var weatherData = JSON.parse(data);

      try {
        var currentWeather = new WeatherData(weatherData.name, weatherData.main.temp, weatherData.weather[0].main,
          weatherData.main.feels_like, weatherData.wind.speed, weatherData.main.humidity)

        var currWeather = weatherData;

        var imgsrc = weatherData.weather[0].icon;

        var icon = "http://openweathermap.org/img/wn/" + imgsrc + "@2x.png"
      } catch (err) {
        icon = null;

        var current = {
          location: "Invalid Location",
          temperature: 1,
          description: "empty",
          feels_like: "empty",
          wspeed: 1,
          humidity: 1,
          icon: "empty"
        }
        res.render("list", {
          currForecast: current,
          kindOfDay: currentDate,
          weatherIcon: icon
        });

      }
      res.render("list", {
        currForecast: currentWeather,
        kindOfDay: currentDate,
        weatherIcon: icon
      });

    })
  })


});
app.post("/", function searchLocation(req, res) {
  // newItem is the name used in the html
  unit[0] = req.body.deg;
  defaultLocation.length = 0;
  j = 0;
  var newLocation = req.body.newItem;
  defaultLocation.push(newLocation);
  res.redirect("/");
});

//return forecast
app.get("/forecast", function getForecast(req, res){ 

  query = defaultLocation[0];
  const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + key + "&units=" + unit[0];

  https.get(url, function(response) {
    let result = '';
    response.on("data", function(data){
      result += data;





    });
    response.on('end',()=>{
      try{

      const weatherData = JSON.parse(result);

      var imgsrc = weatherData.list[0].weather[0].icon;
      var icon = "http://openweathermap.org/img/wn/" + imgsrc + "@2x.png"
      for (i = 0; i < weatherData.list.length; i++) {
        // we get all the values for 12pm
        if (weatherData.list[i].dt_txt.includes("12:00:00")) {
          var dayForeCast = new ForecastData(weatherData.list[i].main.temp,weatherData.city.name,weatherData.list[i].weather[0].main,weatherData.list[i].dt_txt);
          var wicon = weatherData.list[i].weather[0].icon;
          var imgurl = "http://openweathermap.org/img/wn/" + wicon + "@2x.png";
          weatherIcons[j] = imgurl;
          dayholder[j] = dayForeCast;
          j++;
        }
      }
    }catch(err){
      console.log(err)
      empty=[0,0,0,0]
      res.render("forecast", {
        imge:empty,
        forecast:empty,
        kindOfDay:"Invalid Location"

      });
    }

    res.render("forecast", {
        imge: weatherIcons,
        forecast: dayholder,
        kindOfDay:currentDate

      });
    });

  })

});


//return locations
app.get("/locations", function getLocations(req, res) {

  Location.find({},function(err,foundItems){
      for (k = 0; k < foundItems.length; k++) {
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + foundItems[k].city + "&appid=" + key + "&units=" + units + "";
        https.get(url, function(response) {
          response.on("data", function(data) {
            const weatherData = JSON.parse(data);

            Location.updateOne({city: weatherData.name}, {temp: weatherData.main.temp}, function(err, res) {});
          })
        })
      }
      res.render("locations",{cities:foundItems,kindOfDay:currentDate});
  })
})
app.post("/locations", function removeLocation(req, res) {
  var city = req.body.location;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key + "&units=" + units + "";
  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      var currentDate = today.toLocaleDateString("en-US", options);
      try {
        const location = new Location({
          city: city,
          temp: weatherData.main.temp
          // console.log("entered new location")
        })
        location.save();
        res.redirect("/locations");
      } catch (err) {
        console.log("Enter a Valid Location")
        res.redirect("/locations");
      }

    })
  })

})
app.post("/delete", function deleteLocation(req, res) {
  const locationId = req.body.delete;
  Location.findByIdAndRemove(locationId, function(err) {
    if (!err) {
      console.log("location removed")
      res.redirect("/locations")
    }
  })
})

app.get("/weathermap", function getWeatherMap(req, res) {
  res.render("weathermap", {
    map_type: mapView[0]
  })
})
app.post("/weathermap", function getViewType(req, res) {
  const type = req.body.mapType;
  mapView[0] = type;
  res.redirect("/weathermap");

})
//connect to heroku server

let port = process.env.PORT;
if(port== null|| port ==""){
  port=3000;
}

app.listen(port,function() {
  console.log("running");
})

