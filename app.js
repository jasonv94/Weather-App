const express= require("express");
const bodyParser= require("body-parser");
const https= require("https");
const app= express();
var items=[];
var workItems=[];
app.set('view engine','ejs');
// app.use is used to access the HTML elements
/////////////////////////////////date info
var today= new Date();
var options={
  weekday:"long",
  day:"numeric",
  month:"long"

};
//////////////////////////////date info
///////////////////////////////info for query
query="Sydney,Australia";
units="metric";
key="********************";
///////API Key open weather map
const url="https://api.openweathermap.org/data/2.5/forecast?q="+query+"&appid="+key+"&units="+units+"";
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",function(req,res){
  console.log(items[0]);

  https.get(url,function(response){

  response.on("data",function(data){
    const weatherData=JSON.parse(data);
    var currentDate=today.toLocaleDateString("en-US",options);
    var currWeather=weatherData;
    console.log(weatherData.list[3].main.temp);

    res.render("list",{listTitle:weatherData,kindOfDay: currentDate,newListItem: items});

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
  items.length=0;

  var item=req.body.newItem;
  console.log(item);
  items.push(item);
  res.redirect("/");
});

app.get("/about",function(req,res){
  res.render("about");
})
app.listen(4000,function(){
  console.log("running");
})
