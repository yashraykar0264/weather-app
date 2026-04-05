let weatherChart = null;

// search
function getWeather(){
  const city = document.getElementById("city").value;
  fetchWeather(`https://weather-app-ivt9.onrender.com/weather?city=${city}`, city);
}

// location
function getLocation(){
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude, longitude} = pos.coords;
    fetchWeather(`https://weather-app-ivt9.onrender.com/weather?lat=${latitude}&lon=${longitude}`);
  });
}

// toggle
function toggleMode(){
  document.body.classList.toggle("light");
}

// fetch
async function fetchWeather(url, cityInput){
  const res = await fetch(url);
  const data = await res.json();

  if(!data.name){
    document.getElementById("result").innerHTML="❌ Not found";
    return;
  }

  const city = data.name;

  saveHistory(city);

  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("result").innerHTML=`
    <h2>${city}</h2>
    <img src="${icon}">
    <h1>${data.main.temp} °C</h1>
    <p>${data.weather[0].main}</p>
  `;

  aiSuggestion(data.weather[0].main);

  getForecast(city);
}

// AI suggestion 🤖
function aiSuggestion(type){
  let msg="";

  if(type==="Rain") msg="🌧 Take umbrella";
  else if(type==="Clear") msg="☀️ Enjoy day";
  else if(type==="Clouds") msg="☁️ Chill weather";
  else msg="🌍 Stay safe";

  document.getElementById("ai").innerHTML=msg;
}

// forecast
async function getForecast(city){
  const res = await fetch(`https://weather-app-ivt9.onrender.com/forecast?city=${city}`);
  const data = await res.json();

  const temps=[];
  const labels=[];

  for(let i=0;i<data.list.length;i+=8){
    temps.push(data.list[i].main.temp);
    labels.push(data.list[i].dt_txt.split(" ")[0]);
  }

  drawChart(labels,temps);
}

// chart
function drawChart(labels,temps){
  const ctx=document.getElementById("chart");

  if(weatherChart) weatherChart.destroy();

  weatherChart=new Chart(ctx,{
    type:"line",
    data:{
      labels,
      datasets:[{
        label:"Temp",
        data:temps
      }]
    }
  });
}

// history
function saveHistory(city){
  let h=JSON.parse(localStorage.getItem("h"))||[];
  if(!h.includes(city)) h.unshift(city);
  if(h.length>5) h.pop();

  localStorage.setItem("h",JSON.stringify(h));
  showHistory();
}

function showHistory(){
  const h=JSON.parse(localStorage.getItem("h"))||[];
  const div=document.getElementById("history");
  div.innerHTML="";

  h.forEach(c=>{
    const el=document.createElement("span");
    el.className="history-item";
    el.innerText=c;
    el.onclick=()=>{
      document.getElementById("city").value=c;
      getWeather();
    };
    div.appendChild(el);
  });
}

showHistory();