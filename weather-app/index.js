const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

const apiKey = import.meta.env.VITE_API_KEY;

weatherForm.addEventListener("submit", async event=>{
    event.preventDefault();
    const city=cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            console.log(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    } else{
        displayError("Please Enter a City");
    }
});

async function getWeatherData(city){
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        console.log(response);
        if(!response.ok){
            throw new Error("Could not fetch weather data");
        }else{
            return await response.json();
        }
}

function displayWeatherInfo(data){

    const {name: city, main:{temp,humidity},weather:[{description,id}]} = data;

    card.textContent = "";
    card.style.display="flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent= city;
    cityDisplay.classList.add("cityDisplay");

    const fahrenheitTemp = Math.floor((temp-273.15)*(9/5) + 32);

    tempDisplay.textContent = `${fahrenheitTemp}°`;
    tempDisplay.classList.add("tempDisplay");

    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    humidityDisplay.classList.add("humidityDisplay");

    descDisplay.textContent = description;
    descDisplay.classList.add("descDisplay");

    weatherEmoji.textContent = getWeatherEmoji(id);
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);



}

function getWeatherEmoji(weatherId){
    switch(true){
        case(weatherId>=200 && weatherId<300):
            return "⛈️";
            break;
        case(weatherId>=300 && weatherId<400):
            return "🌧️";
            break;
        case(weatherId>=500 && weatherId<600):
            return "🌧️";
            break;
        case(weatherId>=600 && weatherId<700):
            return "❄️";
            break;
        case(weatherId>=700 && weatherId<800):
            return "🌫️";
            break;
        case(weatherId===800):
            return "☀️";
            break;
        case(weatherId>800 && weatherId<810):
            return "☁️";
            break;
        default:
            return "?";
    }
}

function displayError(error){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = error;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}