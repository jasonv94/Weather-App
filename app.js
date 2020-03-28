//express,bodyParser,https requires assigned libraries for interaciton between js and html(ejs) pages
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const WeatherData = require("./weatherdata.js") ////WeatherData class
const ForecastData= require("./forecastdata.js")
const app = express();
//mongoose db connection
const mongoose = require('mongoose');
//mongoose connection
mongoose.connect("mongodb://localhost:27017/locationsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//db schema
const locationSchema = {
  city: String,
  temp: String
};
const Location = mongoose.model("Location", locationSchema);
var defaultLocation = ["Abbotsford"];
var workItems = [];
var newarr = [];
var fiveForecast = [];
var dayholder = [];
var weatherIcons = [] //use to hold the icons we will need to change
var j = 0;//index for the 4 day forecast
var savedTemps = [0];
var mapView = ["temp_new"];//default for map view
const unit = ["metric"];//default units metric
const cityUpdate = [];//used for getting real time data for saved locations
app.set('view engine', 'ejs');
var z=0;
// app.use is used to access the HTML elements
/////////////////////////////////date info


// going to try and change the app so homepage is current weather we will use a new page for forecast
var today = new Date();
var options = {
  weekday: "long",
  day: "numeric",
  month: "long"

};
const currentDate = today.toLocaleDateString("en-US", options);
//////////////////////////////date info
///////////////////////////////info for query
units = "metric";
key = "9ea0171656c27a5884112d1c503edab8";
//////////info for query
// maybe add in API KEY

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
        if (currentWeather.location === undefined) {
          currWeather.location = 0;
        }

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
app.post("/", function(req, res) {
  // newItem is the name used in the html
  unit[0] = req.body.deg;
  defaultLocation.length = 0;
  j = 0;
  var newLocation = req.body.newItem;
  defaultLocation.push(newLocation);
  res.redirect("/");
});
// this is for forecast page hopefully will be used for that
// getForecast added in we
app.get("/forecast", function getForecast(req, res) { //look at adding objeect so instead of function it is object.function vs function
  query = defaultLocation[0];
  console.log(unit[0])
  const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + key + "&units=" + unit[0] + "";
  // const curl=https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=9ea0171656c27a5884112d1c503edab8&units=metric
  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      var currWeather = weatherData;
      var imgsrc = weatherData.list[0].weather[0].icon;
      var icon = "http://openweathermap.org/img/wn/" + imgsrc + "@2x.png"
      for (i = 0; i < weatherData.list.length; i++) {
        // we get all the values for 12pm
        if (weatherData.list[i].dt_txt.includes("12:00:00")) {
          var dayForeCast = new ForecastData(weatherData.list[i].main.temp,weatherData.city.name,weatherData.list[i].weather[0].main,weatherData.list[i].dt_txt);
          var wicon = weatherData.list[i].weather[0].icon;
          var imgurl = "http://openweathermap.org/img/wn/" + wicon + "@2x.png";
          weatherIcons[j] = imgurl;
          fiveForecast[j] = weatherData.list[i];
          dayholder[j] = dayForeCast;
          j++;
        }
      }
      res.render("forecast", {
        imge: weatherIcons,
        forecast: dayholder,
        kindOfDay:currentDate

      });

    })
  })

});
app.get("/locations", function getLocations(req, res) {
  // var currentDate = today.toLocaleDateString("en-US", options);
  cityUpdate.length = 0;
  Location.find({}, function(err, foundItems) {
    //This is the top check and see if it all loads tommorow
    for (k = 0; k < foundItems.length; k++) {
      console.log('this'+k)
      cityUpdate.push(foundItems[k].city);
    }
    for (k = 0; k < cityUpdate.length; k++) {
      console.log('this'+k)
      console.log(cityUpdate[k]);
    }
    // res.render("locations", {kindOfDay: currentDate,cities: foundItems});
    for (k = 0; k < cityUpdate.length; k++) {
      const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityUpdate[k] + "&appid=" + key + "&units=" + units + "";
      console.log("this"+cityUpdate[k]+""+url)
      https.get(url, function(response) {
        response.on("data", function(data) {
          const weatherData = JSON.parse(data);
          console.log("call number"+k+" "+weatherData.name+" "+weatherData.main.temp)
          Location.updateOne({city: weatherData.name}, {temp: weatherData.main.temp}, function(err, res) {});
        })
      })
    }
  })
  //Location.deleteMany({},function(err){});

  //bottom to uncomment
  // console.log(foundItems[0].city)
  Location.find({},function(err,foundItems){
//thi was copy and pasted
      //copy and pasted up to here
      res.render("locations",{cities:foundItems,kindOfDay:currentDate});
  })
})
app.post("/locations", function removeLocation(req, res) {
  var city = req.body.location;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key + "&units=" + units + "";
  // const curl=https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=9ea0171656c27a5884112d1c503edab8&units=metric
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
        cityUpdate.push(city);
        location.save();

      } catch (err) {
        console.log('invalid');
      }
      res.redirect("/locations")
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
app.post("/weathermap", function(req, res) {
  const type = req.body.mapType;
  mapView[0] = type;
  res.redirect("/weathermap");

})

app.listen(4000, function() {
  console.log("running");
})
