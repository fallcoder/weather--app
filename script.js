// API KEY for accessing OpenWeatherMap API 
const apiKey = "put-your-api-key-here";

// function to get weather data based on coordinates
function getWeatherByCoordinates(latitude, longitude) {
     // build API URL using coordinates and API key
     const weatherApiapiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        
     // query to get weather data
     fetch(weatherApiapiUrl)
     .then(res => {
         // check for response status
         if(!res.ok) {
             // if the response is not correct, throw an error
             throw new Error('City not found. Please enter a valid city name.');
         }
         // convert response to JSON
         return res.json();
     })
     .then(data => {
        // update the UI with weather data
        updateUI(data)
     })
     .catch(error => {
        showError(error)
     })
}

// function to update the UI with weather data
function updateUI(data) {
    // Update UI with weather data
    document.getElementById('weather-image').src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    document.getElementById('temperature').textContent = `${data.main.temp}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed}Km/H`;

    // display the weather container and hide the search container
    document.getElementById('weather-container').style.display = 'block';
}

// function to show error mesage
function showError(error) {
    // display error message in the error container
    document.getElementById('error-msg').style.display = 'block';
    document.getElementById('error-msg').textContent = error.message;
    
    // hide the weather container and show the search container
    document.getElementById('search-container').style.display = 'block';
    document.getElementById('weather-container').style.display = 'none';
}

// function to get city name from coordinates
function getCityName(latitude, longitude) {
    const apiKey = "put-your-api-key-here";
    const cityNameApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    // query to retrieve city data
    fetch(cityNameApiUrl)
    .then(res => {
        if(!res.ok) {
            throw new Error('Failed to retrieve city name')
        }
        return res.json();
    })
    .then(data => {
        let cityName = 'Unknown';
        if(data.name) {
            cityName = data.name;
        }
    
        // update search field value with city name
        document.getElementById('search-box').value = cityName;
    })
    .catch(error => {
        // display error msg if an error occurs
        showError(error)
    });
}

// function to get weather data based on user's geolocation
function getWeatherByGeolocation() {
    // check if geolocation is supported by the browser
    if(navigator.geolocation) {
        // get current user's contact details
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // get city name from coordinates
            getCityName(latitude, longitude);
            // get weather data based on coordinates
            getWeatherByCoordinates(latitude, longitude);
        },
        error => {
            // show an error msg if geolocation fails
            showError(new Error('Geolocation failed. Please enter a city name manually'));
        });
    }
    else {
        // display an error msg if geolocation is not supported
        showError(new Error('Geolocation failed. Please enter a city name manually'));
    }
}

// search button event listener
document.getElementById('search-button').addEventListener('click', function(e) {
    e.preventDefault();
    // get the entered city from the search box and trim any leading/trailing whitespace
    const city = document.getElementById('search-box').value.trim();

    // hide weather container and error message initially
    document.getElementById('weather-container').style.display = 'none';
    document.getElementById('error-msg').style.display = 'none';

    // error handling for empty input
    if(!city) {
        // if search is empty, get weather data based on user's geolocation
        getWeatherByGeolocation();
    }
    else {
        // otherwise get weather data based on city name entered by user
        const cityWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        fetch(cityWeatherApiUrl)
        .then(res => {
            if(!res.ok) {
                throw new Error('City not found. Please enter a valid city name')
            }
            return res.json();
        })
        .then(data => {
            // update UI with weather data
            updateUI(data)
        })
        .catch(error => {
            // display error msg if an error occurs
            showError(error)
        })
    }
});

// call getWeatherByGeolocation function to get weather data based on user's geoloaction
getWeatherByGeolocation();