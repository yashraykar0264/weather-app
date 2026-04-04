require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000;

// 🌤 Current weather
app.get("/weather", async (req, res) => {
  const city = req.query.city;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

// 📊 Forecast
app.get("/forecast", async (req, res) => {
  const city = req.query.city;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ error: "Failed to fetch forecast" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});