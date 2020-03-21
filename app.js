const express= require("express");
const bodyParser= require("body-parser");
const https= require("https");
const app= express();
const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/locationsDB",{ useNewUrlParser: true,useUnifiedTopology: true});
const locationSchema={
  city:String,
  temp:String

};
const Location=mongoose.model("Location",locationSchema);
var items=["Abbotsford"];
var savedLocations
var workItems=[];
var newarr=[];
var fiveForecast=[];
var dayholder=[];
var weatherIcons=[]//use to hold the icons we will need to change
var j=0;
var savedLocations=["Default"];
var savedTemps=[0];
var mapView=["temp_new"];
const unit=["metric"];
app.set('view engine','ejs');
// app.use is used to access the HTML elements
/////////////////////////////////date info


// going to try and change the app so homepage is current weather we will use a new page for forecast
var today= new Date();
var options={
  weekday:"long",
  day:"numeric",
  month:"long"

};
//////////////////////////////date info
///////////////////////////////info for query
units="metric";
key="9ea0171656c27a5884112d1c503edab8";
//////////info for query
// maybe add in API KEY

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",function(req,res){
  console.log(items[0]);
  query=items[0];
  console.log(req.body.deg);
  const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+key+"&units="+units+"";

  https.get(url,function(response){
    console.log(req.body.deg);

  response.on("data",function(data){
    console.log(req.body.deg);

    var weatherData=JSON.parse(data);
    var currentDate=today.toLocaleDateString("en-US",options);
    try{
           var currentWeather={
               location:weatherData.name,
               temperature:weatherData.main.temp,
               description:weatherData.weather[0].main,
               feels_like:weatherData.main.feels_like,
               wspeed:weatherData.wind.speed,
               humidity:weatherData.main.humidity,
               icon:"http://openweathermap.org/img/wn/"+weatherData.weather[0].id+"@2x.png"

             }
            if (currentWeather.location===undefined){
              currWeather.location=0;
            }


    var currWeather=weatherData;

    var imgsrc=weatherData.weather[0].icon;

    var icon="http://openweathermap.org/img/wn/"+imgsrc+"@2x.png"
  }catch(err){
    icon=null;
    var current={
        location:"Invalid",
        temperature:1,
        description:"empty",
        feels_like:"empty",
        wspeed:1,
        humidity:1,
        icon:"empty"
      }
    res.render("list",{currForecast:current,kindOfDay: currentDate,weatherIcon:icon});

  }
    res.render("list",{currForecast:currentWeather,kindOfDay: currentDate,weatherIcon:icon});

  })
  })


});
// https.get(url,function(response){
//
//   response.on("data",function(data){
//   const weatherData=JSON.parse(data);
//   val={temperature:weatherData.main.temp};
//   res.render("list",{listTitle:val.temperature,kindOfDay: val.temperature,newListItem: val.temperature});
//
// });
//
// });
// use this to write back to the get which adds to the page
// this will be used to receive city name,country name append it to the api call later
app.post("/",function(req,res){
  // newItem is the name used in the html
  console.log(req.body.deg);
  items.length=0;
  j=0;
  var item=req.body.newItem;
  console.log(item);
  items.push(item);
  res.redirect("/");
});
// this is for forecast page hopefully will be used for that
// getForecast added in we
app.get("/about",function getForecast(req,res){//look at adding objeect so instead of function it is object.function vs function
  query=items[0];
  const url="https://api.openweathermap.org/data/2.5/forecast?q="+query+"&appid="+key+"&units="+units+"";
  // const curl=https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=9ea0171656c27a5884112d1c503edab8&units=metric

  https.get(url,function(response){
  response.on("data",function(data){
    const weatherData=JSON.parse(data);
    var currentDate=today.toLocaleDateString("en-US",options);
    var currWeather=weatherData;
    var imgsrc=weatherData.list[0].weather[0].icon;
    var icon="http://openweathermap.org/img/wn/"+imgsrc+"@2x.png"
    for(i=0;i<weatherData.list.length;i++){
      // we get all the values for 12pm
      if(weatherData.list[i].dt_txt.includes("12:00:00")){
        var dayForeCast={
          temperature:weatherData.list[i].main.temp,
          description:weatherData.list[i].weather[0].main,
          date:weatherData.list[i].dt_txt

        }
        var iconed=weatherData.list[i].weather[0].icon;
        var imgurl="http://openweathermap.org/img/wn/"+iconed+"@2x.png";
        weatherIcons[j]=imgurl;
        fiveForecast[j]=weatherData.list[i];
        dayholder[j]=dayForeCast;
        j++;
      }
    }
    res.render("about",{fiveForecast:weatherData,kindOfDay: currentDate,newListItem: items,weatherIcon:icon,imge:weatherIcons,testing:dayholder});

  })
  })

});
app.get("/locations",function(req,res){
   var currentDate=today.toLocaleDateString("en-US",options);
   Location.find({},function(err,foundItems){
   console.log(foundItems)
   res.render("locations",{kindOfDay:currentDate,cities:foundItems});
   })
  })
app.post("/locations",function(req,res){
  var city=req.body.location;
  const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+key+"&units="+units+"";
  // const curl=https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=9ea0171656c27a5884112d1c503edab8&units=metric
  https.get(url,function(response){
  response.on("data",function(data){
    const weatherData=JSON.parse(data);
    var currentDate=today.toLocaleDateString("en-US",options);
    try{
    const location= new Location({
      city:city,
      temp:weatherData.main.temp
    })
    location.save();
  }catch(err){
    console.log('invalid');
  }
    res.redirect("/locations")
  })
  })
})
app.post("/delete",function(req,res){
  const locationId=req.body.delete;
  Location.findByIdAndRemove(locationId,function(err){
    if(!err){
      console.log("location removed")
      res.redirect("/locations")
    }
  })
})

app.get("/weathermap",function(req,res){
  console.log(mapView[0])
  res.render("weathermap",{map_type:mapView[0]})
})
app.post("/weathermap",function(req,res){

  const type=req.body.mapType;
  mapView[0]=type;
  console.log(type)
  res.redirect("/weathermap");



})

app.listen(4000,function(){
  console.log("running");
})
