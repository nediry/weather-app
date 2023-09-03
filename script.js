// HTML elements
const form = document.querySelector("form");
const todayDay = document.querySelector(".today-left :first-child");
const todayDate = document.querySelector(".today-left :nth-child(2)");
const todayLocation = document.querySelector(".today-left > div > span");
const todayIcon = document.querySelector(".today-right :first-child");
const todayTemperature = document.querySelector(".today-right :nth-child(2)");
const todayDescription = document.querySelector(".today-right :nth-child(3)");
const todayPrecipitation = document.querySelector(".today-detail :first-child");
const todayHumidity = document.querySelector(".today-detail :nth-child(2)");
const todayWindSpeed = document.querySelector(".today-detail :nth-child(3)");


const futureDays = document.querySelector(".future");

// Define a mapping of weather icons
const weatherIcons = {
    "01d": "bi bi-sun-fill",             // Clear sky (day)
    "01n": "bi bi-moon-fill",            // Clear sky (night)
    "02d": "bi bi-cloud-sun-fill",       // Few clouds (day)
    "02n": "bi bi-cloud-moon-fill",      // Few clouds (night)
    "03d": "bi bi-cloud-fill",           // Scattered clouds (day)
    "03n": "bi bi-cloud-fill",           // Scattered clouds (night)
    "04d": "bi bi-clouds-fill",          // Broken clouds (day)
    "04n": "bi bi-clouds-fill",          // Broken clouds (night)
    "09d": "bi bi-cloud-rain-fill",      // Shower rain (day)
    "09n": "bi bi-cloud-rain-fill",      // Shower rain (night)
    "10d": "bi bi-cloud-rain-fill",      // Rain (day)
    "10n": "bi bi-cloud-rain-fill",      // Rain (night)
    "11d": "bi bi-cloud-lightning-fill", // Thunderstorm (day)
    "11n": "bi bi-cloud-lightning-fill", // Thunderstorm (night)
    "13d": "bi bi-cloud-snow-fill",      // Snow (day)
    "13n": "bi bi-cloud-snow-fill",      // Snow (night)
    "50d": "bi bi-cloud-haze-fill",      // Haze (day)
    "50n": "bi bi-cloud-haze-fill"       // Haze (night)
};

const fetchData = (city) => {
    // Replace with your API key
    const apiKey = "your_api_key";

    // Use fetch to make a request to the Weather API
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(apiUrl).then(response => {
        if (!response.ok) {
            throw new Error("Weather data could not be retrieved.");
        }
        return response.json();
    })
        .then(data => {

            // Update the city name and today's weather information
            todayDay.textContent = new Date().toLocaleDateString("en", { weekday: "long" });
            todayDate.textContent = new Date().toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" });
            todayLocation.textContent = `${data.city.name}, ${data.city.country}`;

            todayIcon.className = weatherIcons[data.list[0].weather[0].icon];
            todayTemperature.innerHTML = `${Math.round(data.list[0].main.temp)}&#8451;`;
            todayDescription.textContent = data.list[0].weather[0].description;

            todayPrecipitation.textContent = `Precipitation : ${data.list[0].pop}%`;
            todayHumidity.textContent = `Humidity : ${data.list[0].main.humidity}%`;
            todayWindSpeed.textContent = `Wind Speed : ${data.list[0].wind.speed} m/s`;

            // Get weather data for the next 4 days
            const futureWeather = data.list.slice(8, 40); // 5-day data with readings every 3 hours
            futureDays.innerHTML = "";

            // Create and display weather information dynamically
            futureWeather.forEach((forecast, index) => {
                if (index % 8 === 0) {

                    const date = new Date(forecast.dt * 1000);
                    const day = date.toLocaleDateString("en", { weekday: "long" });
                    const temperature = Math.round(forecast.main.temp);
                    const description = forecast.weather[0].description;
                    const icon = forecast.weather[0].icon;

                    const futureDayElement = document.createElement("div");
                    futureDayElement.classList.add("future-day");
                    futureDayElement.innerHTML = `

                        <p class="day">${day}</p>
                        <i class="${weatherIcons[icon]}"></i>
                        <p class="temperature">${temperature}°C</p>
                        <p class="description">${description}</p>

                    `;
                    futureDays.appendChild(futureDayElement);
                }
            });
        })
        .catch((error) => {
            console.error(error);
            // Show an alert to the user in case of an error
            alert("Weather data could not be retrieved.");
        });
}

// Fetch weather data on document load for default city
document.addEventListener("DOMContentLoaded", function () {
    const defaultLocation = "istanbul";
    fetchData(defaultLocation);
});

// Listen for the submit event on the search box
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("input");

    // Get the city name entered sby the user
    const city = input.value;
    if (city.trim() === "") {
        alert("Please enter a city name.");
        return;
    } else {
        fetchData(city);
        input.value = "";
    }
});