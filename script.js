let weatherChart = null;

// 🔍 search
function getWeather() {
  const city = document.getElementById("city").value.trim();
  if (!city) return;

  document.getElementById("result").innerHTML = "⏳ Loading...";

  fetchWeather(`https://weather-app-ivt9.onrender.com/weather?city=${city}`, city);
}

// 🔥 fetch weather
async function fetchWeather(url, cityInput) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.name) {
      document.getElementById("result").innerHTML = "❌ City not found";
      return;
    }

    const city = data.name;
    saveHistory(city);

    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById("result").innerHTML = `
      <h2>${city}</h2>
      <img src="${icon}">
      <h1>${data.main.temp} °C</h1>
      <p>${data.weather[0].main}</p>
      <p>💧 ${data.main.humidity}% | 🌬 ${data.wind.speed} m/s</p>
    `;

    getForecast(city);

  } catch (error) {
    document.getElementById("result").innerHTML = "⚠️ Error loading data";
  }
}

// 📊 forecast
async function getForecast(city) {
  try {
    const res = await fetch(`https://weather-app-ivt9.onrender.com/forecast?city=${city}`);
    const data = await res.json();

    const temps = [];
    const labels = [];

    for (let i = 0; i < data.list.length; i += 8) {
      temps.push(data.list[i].main.temp);
      labels.push(data.list[i].dt_txt.split(" ")[0]);
    }

    drawChart(labels, temps);

  } catch (error) {
    console.log("Forecast error");
  }
}

// 📈 chart (FIXED)
function drawChart(labels, temps) {
  const ctx = document.getElementById("chart");

  if (weatherChart) weatherChart.destroy();

  weatherChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Temperature (°C)",
        data: temps,
        borderWidth: 2
      }]
    }
  });
}

// 📜 history
function saveHistory(city) {
  let h = JSON.parse(localStorage.getItem("h")) || [];
  if (!h.includes(city)) h.unshift(city);
  if (h.length > 5) h.pop();

  localStorage.setItem("h", JSON.stringify(h));
  showHistory();
}

function showHistory() {
  const h = JSON.parse(localStorage.getItem("h")) || [];
  const div = document.getElementById("history");
  div.innerHTML = "";

  h.forEach(c => {
    const el = document.createElement("span");
    el.className = "history-item";
    el.innerText = c;
    el.onclick = () => {
      document.getElementById("city").value = c;
      getWeather();
    };
    div.appendChild(el);
  });
}

// ⌨️ enter key
document.getElementById("city").addEventListener("keypress", e => {
  if (e.key === "Enter") getWeather();
});

// 🔄 load history
showHistory();