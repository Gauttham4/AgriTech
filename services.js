// Configuration
const WEATHER_API_KEY = 'f867d70258fb1fd995aae5a8a56b15e4'; // Replace with your actual Weather API key
const GEMINI_API_KEY = 'AIzaSyA3ZfucaVYmRfrB3PltZPm2YynftGbd7NU'; // Replace with your actual Gemini API key

// DOM Elements
const locationInput = document.getElementById('location-search');
const searchButton = document.getElementById('search-btn');
const currentLocationButton = document.getElementById('current-location-btn');
const weatherCard = document.getElementById('weather-card');
const weatherLoader = weatherCard.querySelector('.weather-loader');
const weatherContent = weatherCard.querySelector('.weather-content');
const weatherError = weatherCard.querySelector('.weather-error');
const weatherLocation = document.getElementById('weather-location');
const currentTemp = document.getElementById('current-temp');
const weatherDesc = document.getElementById('weather-desc');
const feelsLike = document.getElementById('feels-like');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const weatherIcon = document.getElementById('weather-icon');
const forecastContainer = document.getElementById('forecast-container');

// Crop Recommendation Elements
const cropCard = document.getElementById('crop-card');
const cropLoader = cropCard.querySelector('.crop-loader');
const cropContent = cropCard.querySelector('.crop-content');
const cropError = cropCard.querySelector('.crop-error');
const getRecommendationsBtn = document.getElementById('get-recommendations-btn');
const recommendationsContainer = document.getElementById('recommendations-container');
const cropsLoadingDiv = document.querySelector('.crops-loading');
const cropsListDiv = document.getElementById('crops-list');

// Weather Data Storage
let currentWeatherData = null;
let forecastWeatherData = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Search button
    searchButton.addEventListener('click', () => {
        const location = locationInput.value.trim();
        if (location) {
            getWeatherByCity(location);
        }
    });

    // Enter key in search input
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const location = locationInput.value.trim();
            if (location) {
                getWeatherByCity(location);
            }
        }
    });

    // Current location button
    currentLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            showWeatherLoader();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    showWeatherError();
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });

    // Get recommendations button
    getRecommendationsBtn.addEventListener('click', () => {
        if (currentWeatherData) {
            getCropRecommendations();
        } else {
            alert("Please get weather data first.");
        }
    });
});

// Weather Functions
function getWeatherByCity(city) {
    showWeatherLoader();
    
    // Current weather API call
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            currentWeatherData = data;
            // Get forecast data
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${WEATHER_API_KEY}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast data not found');
            }
            return response.json();
        })
        .then(forecastData => {
            forecastWeatherData = forecastData;
            displayWeatherData();
            showCropContent();
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            showWeatherError();
        });
}

function getWeatherByCoords(lat, lon) {
    // Current weather API call
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            currentWeatherData = data;
            // Get forecast data
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast data not found');
            }
            return response.json();
        })
        .then(forecastData => {
            forecastWeatherData = forecastData;
            displayWeatherData();
            showCropContent();
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            showWeatherError();
        });
}

function displayWeatherData() {
    if (!currentWeatherData) return;

    // Set current weather values
    weatherLocation.textContent = `${currentWeatherData.name}, ${currentWeatherData.sys.country}`;
    currentTemp.textContent = Math.round(currentWeatherData.main.temp);
    weatherDesc.textContent = currentWeatherData.weather[0].description.charAt(0).toUpperCase() + 
                             currentWeatherData.weather[0].description.slice(1);
    feelsLike.textContent = Math.round(currentWeatherData.main.feels_like);
    windSpeed.textContent = `${(currentWeatherData.wind.speed * 3.6).toFixed(1)} km/h`;
    humidity.textContent = `${currentWeatherData.main.humidity}%`;
    pressure.textContent = `${currentWeatherData.main.pressure} hPa`;
    visibility.textContent = `${(currentWeatherData.visibility / 1000).toFixed(1)} km`;
    
    // Set weather icon
    const iconCode = currentWeatherData.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    // Display 5-day forecast
    displayForecast();
    
    // Show weather content
    weatherLoader.classList.add('hidden');
    weatherContent.classList.remove('hidden');
    weatherError.classList.add('hidden');
}

function displayForecast() {
    if (!forecastWeatherData || !forecastWeatherData.list) return;
    
    forecastContainer.innerHTML = '';
    
    // Group forecast data by day (using the date part only)
    const forecastByDay = {};
    
    forecastWeatherData.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!forecastByDay[date]) {
            forecastByDay[date] = item;
        }
    });
    
    // Get only the first 5 days
    const daysList = Object.values(forecastByDay).slice(0, 5);
    
    // Create forecast day elements
    daysList.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const iconCode = day.weather[0].icon;
        const temp = Math.round(day.main.temp);
        
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
            </div>
            <div class="forecast-temp">${temp}°C</div>
        `;
        
        forecastContainer.appendChild(forecastDay);
    });
}

// Crop Recommendation Functions
function getCropRecommendations() {
    if (!currentWeatherData) {
        alert("Please get weather data first.");
        return;
    }
    
    recommendationsContainer.classList.remove('hidden');
    cropsLoadingDiv.style.display = 'flex';
    cropsListDiv.style.display = 'none';
    cropError.classList.add('hidden'); // Hide any previous errors
    
    // Prepare weather data for the AI
    const weatherInfo = {
        location: `${currentWeatherData.name}, ${currentWeatherData.sys.country}`,
        current_temp: currentWeatherData.main.temp,
        feels_like: currentWeatherData.main.feels_like,
        humidity: currentWeatherData.main.humidity,
        pressure: currentWeatherData.main.pressure,
        wind_speed: currentWeatherData.wind.speed,
        weather_condition: currentWeatherData.weather[0].main,
        weather_description: currentWeatherData.weather[0].description
    };
    
    // Instead of using the Gemini API, we'll use a fallback approach
    // This is because the Gemini API endpoint is returning 404 errors
    console.log("Using fallback crop recommendations instead of Gemini API");
    
    // Generate recommendations based on weather conditions
    const recommendations = generateFallbackRecommendations(weatherInfo);
    displayCropRecommendations(recommendations);
}

// Fallback function to generate crop recommendations based on weather conditions
// Replace the generateFallbackRecommendations function with this improved version
function generateFallbackRecommendations(weatherInfo) {
    const temp = weatherInfo.current_temp;
    const humidity = weatherInfo.humidity;
    const weatherCondition = weatherInfo.weather_condition.toLowerCase();
    const weatherDescription = weatherInfo.weather_description.toLowerCase();
    const windSpeed = weatherInfo.wind_speed;
    
    console.log("Generating recommendations based on:", {
        temperature: temp,
        humidity: humidity,
        condition: weatherCondition,
        description: weatherDescription
    });
    
    // Define base crop database with general information
    const cropDatabase = [
        { 
            crop_name: "Rice", 
            base_score: 6, 
            ideal_temp_min: 22, 
            ideal_temp_max: 32,
            ideal_humidity_min: 70,
            ideal_humidity_max: 100,
            rainfall_lover: true,
            description: "Thrives in warm, humid conditions with plenty of water. Perfect for flooded fields and high rainfall areas." 
        },
        { 
            crop_name: "Wheat", 
            base_score: 7, 
            ideal_temp_min: 15, 
            ideal_temp_max: 24,
            ideal_humidity_min: 50,
            ideal_humidity_max: 70,
            rainfall_lover: false,
            description: "Grows well in moderate temperatures with mild humidity. Can withstand some drought conditions." 
        },
        { 
            crop_name: "Corn (Maize)", 
            base_score: 6, 
            ideal_temp_min: 21, 
            ideal_temp_max: 32,
            ideal_humidity_min: 50,
            ideal_humidity_max: 80,
            rainfall_lover: false,
            description: "Requires warm temperatures and moderate moisture. Sensitive to frost and extreme heat." 
        },
        { 
            crop_name: "Potatoes", 
            base_score: 6, 
            ideal_temp_min: 10, 
            ideal_temp_max: 25,
            ideal_humidity_min: 60,
            ideal_humidity_max: 80,
            rainfall_lover: false,
            description: "Prefers cooler temperatures with consistent moisture. Grows well in loamy, well-drained soil." 
        },
        { 
            crop_name: "Tomatoes", 
            base_score: 6, 
            ideal_temp_min: 20, 
            ideal_temp_max: 30,
            ideal_humidity_min: 50,
            ideal_humidity_max: 70,
            rainfall_lover: false,
            description: "Thrives in warm conditions with moderate humidity. Requires full sun and well-drained soil." 
        },
        { 
            crop_name: "Lettuce", 
            base_score: 5, 
            ideal_temp_min: 7, 
            ideal_temp_max: 18,
            ideal_humidity_min: 60,
            ideal_humidity_max: 80,
            rainfall_lover: true,
            description: "Prefers cool temperatures and consistent moisture. Heat causes bolting and bitter taste." 
        },
        { 
            crop_name: "Spinach", 
            base_score: 5, 
            ideal_temp_min: 5, 
            ideal_temp_max: 20,
            ideal_humidity_min: 50,
            ideal_humidity_max: 80,
            rainfall_lover: true,
            description: "Cool-season crop that bolts in high heat. Tolerates light frost and prefers consistent moisture." 
        },
        { 
            crop_name: "Carrots", 
            base_score: 6, 
            ideal_temp_min: 10, 
            ideal_temp_max: 25,
            ideal_humidity_min: 50,
            ideal_humidity_max: 70,
            rainfall_lover: false,
            description: "Grows best in cool to moderate temperatures with well-drained, sandy soil. Too much water causes split roots." 
        },
        { 
            crop_name: "Soybeans", 
            base_score: 7, 
            ideal_temp_min: 20, 
            ideal_temp_max: 30,
            ideal_humidity_min: 60,
            ideal_humidity_max: 80,
            rainfall_lover: false,
            description: "Thrives in warm conditions with moderate humidity. Tolerant to various soil types." 
        },
        { 
            crop_name: "Onions", 
            base_score: 6, 
            ideal_temp_min: 13, 
            ideal_temp_max: 24,
            ideal_humidity_min: 40,
            ideal_humidity_max: 70,
            rainfall_lover: false,
            description: "Prefers cooler temperatures and drier conditions. Too much moisture can lead to rot." 
        },
        { 
            crop_name: "Sunflower", 
            base_score: 7, 
            ideal_temp_min: 18, 
            ideal_temp_max: 30,
            ideal_humidity_min: 40,
            ideal_humidity_max: 60,
            rainfall_lover: false,
            description: "Heat and drought tolerant once established. Prefers full sun and well-drained soil." 
        },
        { 
            crop_name: "Cotton", 
            base_score: 6, 
            ideal_temp_min: 21, 
            ideal_temp_max: 35,
            ideal_humidity_min: 40,
            ideal_humidity_max: 65,
            rainfall_lover: false,
            description: "Grows best in hot weather with moderate humidity. Requires a long, frost-free period." 
        },
        { 
            crop_name: "Sugarcane", 
            base_score: 5, 
            ideal_temp_min: 24, 
            ideal_temp_max: 38,
            ideal_humidity_min: 60,
            ideal_humidity_max: 85,
            rainfall_lover: true,
            description: "Tropical crop that thrives in hot, humid conditions with plenty of water. Sensitive to frost." 
        },
        { 
            crop_name: "Bell Peppers", 
            base_score: 6, 
            ideal_temp_min: 18, 
            ideal_temp_max: 28,
            ideal_humidity_min: 50,
            ideal_humidity_max: 70,
            rainfall_lover: false,
            description: "Prefers warm temperatures, full sun, and consistent moisture. Not frost tolerant." 
        },
        { 
            crop_name: "Cucumbers", 
            base_score: 5, 
            ideal_temp_min: 18, 
            ideal_temp_max: 30,
            ideal_humidity_min: 60,
            ideal_humidity_max: 80,
            rainfall_lover: true,
            description: "Warm-season crop that requires consistent moisture and warm temperatures. Does not tolerate frost." 
        },
        { 
            crop_name: "Strawberries", 
            base_score: 6, 
            ideal_temp_min: 15, 
            ideal_temp_max: 26,
            ideal_humidity_min: 60,
            ideal_humidity_max: 75,
            rainfall_lover: false,
            description: "Prefers cooler temperatures and well-drained soil. Too much rain can cause fruit rot." 
        },
        { 
            crop_name: "Watermelon", 
            base_score: 5, 
            ideal_temp_min: 22, 
            ideal_temp_max: 35,
            ideal_humidity_min: 50,
            ideal_humidity_max: 70,
            rainfall_lover: false,
            description: "Heat-loving crop that requires warm soil and air temperatures. Needs consistent moisture but not waterlogged soil." 
        }
    ];
    
    const recommendations = [];
    
    // Calculate suitability scores for each crop based on current conditions
    cropDatabase.forEach(crop => {
        let score = crop.base_score;
        
        // Temperature factor (most important)
        if (temp >= crop.ideal_temp_min && temp <= crop.ideal_temp_max) {
            // Ideal temperature range
            score += 3;
        } else {
            // Outside ideal range, reduce score based on how far outside
            const tempDistance = Math.min(
                Math.abs(temp - crop.ideal_temp_min),
                Math.abs(temp - crop.ideal_temp_max)
            );
            
            if (tempDistance <= 5) {
                score -= 1;
            } else if (tempDistance <= 10) {
                score -= 2;
            } else {
                score -= 3;
            }
        }
        
        // Humidity factor
        if (humidity >= crop.ideal_humidity_min && humidity <= crop.ideal_humidity_max) {
            score += 1;
        } else {
            score -= 1;
        }
        
        // Weather condition factors
        if (weatherCondition.includes('rain') || weatherDescription.includes('rain')) {
            if (crop.rainfall_lover) {
                score += 1;
            } else {
                score -= 1;
            }
        }
        
        if (weatherCondition.includes('clear') || weatherCondition.includes('sun')) {
            if (!crop.rainfall_lover) {
                score += 1;
            }
        }
        
        // Wind factor - high winds can damage some crops
        if (windSpeed > 8) { // More than 8 m/s is quite windy
            score -= 1;
        }
        
        // Ensure score stays within 1-10 range
        score = Math.max(1, Math.min(10, score));
        
        recommendations.push({
            crop_name: crop.crop_name,
            suitability_score: score,
            description: crop.description
        });
    });
    
    // Sort by suitability score (highest first)
    recommendations.sort((a, b) => b.suitability_score - a.suitability_score);
    
    // Return the top recommendations (up to 8)
    return recommendations.slice(0, 8);
}

// Improve the displayCropRecommendations function to provide more context
function displayCropRecommendations(crops) {
    console.log("Displaying crop recommendations:", crops);
    cropsListDiv.innerHTML = '';
    
    // Add weather context heading
    const weatherContext = document.createElement('div');
    weatherContext.className = 'weather-context';
    weatherContext.innerHTML = `
        <h3>Crop Recommendations for ${currentWeatherData.name}, ${currentWeatherData.sys.country}</h3>
        <p>Based on current conditions: ${Math.round(currentWeatherData.main.temp)}°C, 
           ${currentWeatherData.weather[0].description}, 
           ${currentWeatherData.main.humidity}% humidity</p>
    `;
    cropsListDiv.appendChild(weatherContext);
    
    if (crops.length === 0) {
        const noCropsMessage = document.createElement('div');
        noCropsMessage.className = 'no-crops-message';
        noCropsMessage.textContent = 'No suitable crops found for the current weather conditions.';
        cropsListDiv.appendChild(noCropsMessage);
    } else {
        crops.forEach(crop => {
            const cropElement = document.createElement('div');
            cropElement.className = 'crop-item';
            
            // Create stars based on suitability score (1-10)
            const starRating = document.createElement('div');
            starRating.className = 'crop-rating';
            for (let i = 0; i < 10; i++) {
                const star = document.createElement('i');
                star.className = i < crop.suitability_score ? 'fas fa-star' : 'far fa-star';
                starRating.appendChild(star);
            }
            
            cropElement.innerHTML = `
                <h3 class="crop-name">${crop.crop_name}</h3>
                <div class="crop-rating-container">
                    <div class="rating-label">Suitability: </div>
                    ${starRating.outerHTML}
                    <span class="rating-value">(${crop.suitability_score}/10)</span>
                </div>
                <p class="crop-description">${crop.description}</p>
            `;
            
            cropsListDiv.appendChild(cropElement);
        });
    }
    
    cropsLoadingDiv.style.display = 'none';
    cropsListDiv.style.display = 'block';
}

// Add additional CSS to improve the UI
document.addEventListener('DOMContentLoaded', () => {
    const existingStyle = document.createElement('style');
    existingStyle.textContent += `
        .weather-context {
            background-color: rgba(46, 125, 50, 0.1);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
            color: #2e7d32;
        }
        
        .weather-context h3 {
            margin-top: 0;
            margin-bottom: 8px;
            font-size: 1.3rem;
        }
        
        .weather-context p {
            margin: 0;
            font-size: 1rem;
        }
        
        .no-crops-message {
            background-color: rgba(255, 152, 0, 0.1);
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin-bottom: 15px;
            color: #333;
        }
        
        .rating-value {
            margin-left: 5px;
            color: #666;
            font-size: 0.85rem;
        }
        
        /* Improve crop item design */
        .crop-item {
            background-color: rgba(255, 255, 255, 0.9);
            border-left: 4px solid #2e7d32;
            border-radius: 8px;
            padding: 18px;
            margin-bottom: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
        }
        
        .crop-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
        }
        
        /* Improve the recommendation button style */
        #get-recommendations-btn {
            background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
            color: white;
            border: none;
            border-radius: 30px;
            padding: 12px 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 15px 0;
            width: 100%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
        }
        
        #get-recommendations-btn:hover {
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }
        
        #get-recommendations-btn:active {
            transform: translateY(1px);
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        }
        
        /* Animation for loading crops */
        .crops-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        
        .crops-loading p {
            margin-top: 15px;
            color: #2e7d32;
            font-weight: 500;
        }
    `;
    document.head.appendChild(existingStyle);
});



function displayCropRecommendations(crops) {
    console.log("Displaying crop recommendations:", crops);
    cropsListDiv.innerHTML = '';
    
    crops.forEach(crop => {
        const cropElement = document.createElement('div');
        cropElement.className = 'crop-item';
        
        // Create stars based on suitability score (1-10)
        const starRating = document.createElement('div');
        starRating.className = 'crop-rating';
        for (let i = 0; i < 10; i++) {
            const star = document.createElement('i');
            star.className = i < crop.suitability_score ? 'fas fa-star' : 'far fa-star';
            starRating.appendChild(star);
        }
        
        cropElement.innerHTML = `
            <h3 class="crop-name">${crop.crop_name}</h3>
            <div class="crop-rating-container">
                <div class="rating-label">Suitability: </div>
                ${starRating.outerHTML}
            </div>
            <p class="crop-description">${crop.description}</p>
        `;
        
        cropsListDiv.appendChild(cropElement);
    });
    
    cropsLoadingDiv.style.display = 'none';
    cropsListDiv.style.display = 'block';
}

// UI Helper Functions
function showWeatherLoader() {
    weatherLoader.classList.remove('hidden');
    weatherContent.classList.add('hidden');
    weatherError.classList.add('hidden');
    
    // Reset crop content
    cropLoader.classList.remove('hidden');
    cropContent.classList.add('hidden');
    cropError.classList.add('hidden');
    recommendationsContainer.classList.add('hidden');
}

function showWeatherError() {
    weatherLoader.classList.add('hidden');
    weatherContent.classList.add('hidden');
    weatherError.classList.remove('hidden');
    
    // Reset crop content
    cropLoader.classList.add('hidden');
    cropContent.classList.add('hidden');
    cropError.classList.remove('hidden');
    recommendationsContainer.classList.add('hidden');
}

function showCropContent() {
    cropLoader.classList.add('hidden');
    cropContent.classList.remove('hidden');
    cropError.classList.add('hidden');
    
    // Hide recommendations section initially
    recommendationsContainer.classList.add('hidden');
}

function showCropError() {
    cropsLoadingDiv.style.display = 'none';
    cropsListDiv.style.display = 'none';
    cropError.classList.remove('hidden');
}

// Add some CSS for the crop items to make them look better
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .crop-item {
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .crop-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
        
        .crop-name {
            color: #2e7d32;
            margin-top: 0;
            margin-bottom: 8px;
            font-size: 1.2rem;
        }
        
        .crop-rating-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .rating-label {
            margin-right: 8px;
            font-weight: 500;
        }
        
        .crop-rating {
            color: #ffc107;
            display: inline-block;
        }
        
        .crop-rating i {
            font-size: 0.9rem;
            margin-right: 2px;
        }
        
        .crop-description {
            margin: 0;
            color: #555;
            line-height: 1.5;
        }
        
        /* Fix for the recommendation button */
        .recommend-btn {
            background-color: #2e7d32;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 10px 20px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
            margin: 15px 0;
            width: 100%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .recommend-btn:hover {
            background-color: #1b5e20;
        }
    `;
    document.head.appendChild(style);
});

// Add this to your services.js file or script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Soil Testing Container Expand/Collapse
    const expandButton = document.getElementById('expand-soil-button');
    const soilContent = document.getElementById('soil-testing-content');
    
    if (expandButton && soilContent) {
        expandButton.addEventListener('click', function() {
            soilContent.classList.toggle('expanded');
            expandButton.classList.toggle('expanded');
        });
    }
    
    // Rest of your existing scripts
});
// Fertilizer Guidance Container Toggle
document.addEventListener('DOMContentLoaded', function() {
    const expandFertilizerButton = document.getElementById('expand-fertilizer-button');
    const fertilizerContent = document.getElementById('fertilizer-guidance-content');
    
    if (expandFertilizerButton && fertilizerContent) {
        expandFertilizerButton.addEventListener('click', function() {
            fertilizerContent.classList.toggle('expanded');
            this.classList.toggle('expanded');
        });
    }
});