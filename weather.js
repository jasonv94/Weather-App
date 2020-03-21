const express=require("express");
const https=require("https");
const axios=require("axios");
const request= require("request")

// remeber that comma is added on
const arr=[];
let val;
query="Sydney,";
country="Australia";
units="imperial";
key="9ea0171656c27a5884112d1c503edab8";
const weather={}
// maybe add in API KEY
const url="https://api.openweathermap.org/data/2.5/weather?q="+query+""+country+"&appid="+key+"&units="+units+"";
// "https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=9ea0171656c27a5884112d1c503edab8&units=metric";

var1=https.get(url,function(response){

response.on("data",function(data){
  const weatherData=JSON.parse(data);
  weather.temp=weatherData.main.temp;
  console.log(weather.temp);
})

})
  console.log(weather.temp);

// var obj;
// fetch(url)
//   .then(res => res.json())
//   .then(data => obj = data)
//   .then(() => console.log(obj))
