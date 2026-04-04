let weatherChart = null;

// 🔍 search
function getWeather() {
  const city = document.getElementById("city").value.trim();
  if (!city) return;

  fetchWeather(`http://localhost:5000/weather?city=${city}`, city);
}

// 🔥 fetch weather
async function fetchWeather(url, cityInput) {
  const res = await fetch(url);
  const data = await res.json();

  if (!data.name) {
    document.getElementById("result").innerHTML = "❌ Not found";
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
  `;

  getForecast(city);
}

// 📊 forecast
async function getForecast(city) {
  const res = await fetch(`http://localhost:5000/forecast?city=${city}`);
  const data = await res.json();

  const temps = [];
  const labels = [];

  for (let i = 0; i < data.list.length; i += 8) {
    temps.push(data.list[i].main.temp);
    labels.push(data.list[i].dt_txt.split(" ")[0]);
  }

  drawChart(labels, temps);
}

// 📈 chart
function drawChart(labels, temps) {
  const ctx = document.getElementById("chart");

  if (weatherChart) weatherChart.destroy();

  weatherChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Temp",
        data: temps
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

// enter key
document.getElementById("city").addEventListener("keypress", e => {
  if (e.key === "Enter") getWeather();
});

showHistory();