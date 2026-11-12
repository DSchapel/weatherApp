const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

//We use Vite to load the api key from our env file rather than having it hard-coded 
const apiKey = import.meta.env.VITE_API_KEY;

//Event listener that reacts to user pressing submit button
weatherForm.addEventListener("submit", async event=>{
    event.preventDefault();
    const city=cityInput.value;

    //checks if city was actually inputted and then calls the API fetch function and the display function
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

//Must be an asynchronous function so we can call the API and await a response
async function getWeatherData(city){
        //simple api call to openweather with variables to insert the chosen city and the api key being used which we get from the env
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

    //card is the div/wrapper for the whole display
    card.textContent = "";
    card.style.display="flex";

    //Initialize the elements to which we will assign the necessary text content and class for CSS formatting
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent= city;
    cityDisplay.classList.add("cityDisplay");

    //convert celsius to fahrenheit
    const fahrenheitTemp = Math.floor((temp-273.15)*(9/5) + 32);

    //add temperature to the temp display's text content then assign it the class so CSS will recognize it and format
    tempDisplay.textContent = `${fahrenheitTemp}°`;
    tempDisplay.classList.add("tempDisplay");

    //add humidity to the humidity display's text content then assign it the class so CSS will recognize it and format
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    humidityDisplay.classList.add("humidityDisplay");

    //add description to the description display's text content then assign it the class so CSS will recognize it and format
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

//Simple function to check weather Id we get from api call and based on their handbook assign a proper emoji 
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