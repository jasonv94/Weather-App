const express=require("express");
const https=require("https");
// remeber that comma is added on
// http://api.openweathermap.org/data/2.5/forecast?q=Bali&appid=9ea0171656c27a5884112d1c503edab8&units=metric
const axios=require("axios");

var arr=[];
query="Sydney,";
country="Australia";
units="imperial";
key="9ea0171656c27a5884112d1c503edab8";
const weatherData="";
// maybe add in API KEY
const url="https://api.openweathermap.org/data/2.5/weather?q="+query+""+country+"&appid="+key+"&units="+units+"";
// "https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=9ea0171656c27a5884112d1c503edab8&units=metric";

var urle="https://api.openweathermap.org/data/2.5/forecast?q=Bali&appid=9ea0171656c27a5884112d1c503edab8&units=metric";
var sal=https.get(urle,function(response){
  return response;
});
var2=JSON.parse(url);
console.log(var2);


// let var1=https.get(url,function(response){
//   response.on("data",function(data){
//     const weatherData=JSON.parse(data);
//     temp=weatherData.main.temp;
//     win=weatherData.wind.speed;
//
//     let weather={
//       temperature:weatherData.main.temp,
//       winds:weatherData.wind.speed
//     }
//
//   });
//
// });
