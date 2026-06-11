async function getWeather() {

    const city = document
        .getElementById("city")
        .value
        .trim();

    if (!city) {
        alert("Please enter city name");
        return;
    }

    const weatherBox =
        document.getElementById("weatherBox");

    const detailsCard =
        document.getElementById("detailsCard");

    const forecast =
        document.getElementById("forecast");

    weatherBox.innerHTML = "Loading...";
    detailsCard.innerHTML = "";
    forecast.innerHTML = "";

    try {

        // City Search API
        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

        const geoRes =
            await fetch(geoUrl);

        const geoData =
            await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {

            weatherBox.innerHTML =
                "❌ City not found";

            detailsCard.innerHTML = "";
            forecast.innerHTML = "";

            return;
        }

        const lat =
            geoData.results[0].latitude;

        const lon =
            geoData.results[0].longitude;

        // Weather API
        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=relative_humidity_2m,surface_pressure&timezone=auto`;

        const weatherRes =
            await fetch(weatherUrl);

        const weatherData =
            await weatherRes.json();

        // Details
        const humidity =
            weatherData.hourly.relative_humidity_2m[0];

        const pressure =
            weatherData.hourly.surface_pressure[0];

        const sunrise =
            weatherData.daily.sunrise[0]
                .split("T")[1];

        const sunset =
            weatherData.daily.sunset[0]
                .split("T")[1];

        // Forecast
        let forecastHTML = "";

        const totalDays =
            Math.min(
                6,
                weatherData.daily.time.length
            );

        for (let i = 1; i < totalDays; i++) {

            const date =
                new Date(
                    weatherData.daily.time[i]
                );

            const day =
                date.toLocaleDateString(
                    "en-US",
                    { weekday: "short" }
                );

            const maxTemp =
                weatherData.daily
                    .temperature_2m_max[i];

            const minTemp =
                weatherData.daily
                    .temperature_2m_min[i];

            forecastHTML += `
                <div class="forecast-card">

                    <h3>${day}</h3>

                    <h2>${maxTemp}°C</h2>

                    <p>${minTemp}°C</p>

                </div>
            `;
        }

        // Current Weather
        weatherBox.innerHTML = `
            <h2>
                ${city.charAt(0).toUpperCase() + city.slice(1)}
            </h2>

            <h1>
                ${weatherData.current_weather.temperature}°C
            </h1>

            <p>
                🌬 Wind Speed:
                ${weatherData.current_weather.windspeed}
                km/h
            </p>
        `;

        // Details Card
        detailsCard.innerHTML = `
            <h2>Details</h2>

            <p>🌅 Sunrise: ${sunrise}</p>

            <p>🌇 Sunset: ${sunset}</p>

            <p>💧 Humidity: ${humidity}%</p>

            <p>🌬 Pressure: ${pressure} hPa</p>
        `;

        // Forecast Cards
        forecast.innerHTML =
            forecastHTML;

    } catch (error) {

        console.error(error);

        weatherBox.innerHTML =
            "⚠ Something went wrong";

        detailsCard.innerHTML = "";
        forecast.innerHTML = "";
    }
}


