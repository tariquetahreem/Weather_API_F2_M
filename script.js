//Constants 
const apiKey = '5c1d12e38eae18d3ab142ef3a2751417';
const fetchBtn = document.getElementById('fetchBtn');
const displayLocationPage = document.getElementById('displayLocationPage');
const landingPage = document.getElementById('landingPage');
const locationLats = document.getElementById('locationLats');
const locationLongs = document.getElementById('locationLongs');
const locationFrame = document.getElementById('locationFrame');
const baseURL = `https://api.openweathermap.org/data/2.5/weather?`;
fetchBtn.addEventListener('click', ()=>{
    landingPage.classList.toggle('inactive');
    displayLocationPage.classList.toggle('inactive');
    getWeatherData();
})

// Geting User Geolocation
const getUserLocation = ()=>{
    //Browser Geolocation Support Check
    if ("geolocation" in navigator) {
    return new Promise((resolve, reject)=>{
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const location = {lat: lat, lng: lng};
                resolve(location);
            },
            (error) => {
                reject(`Error getting user location: ${error}`);
            }
            );
        })
    } else {
        console.error("Geolocation is not supported by this browser.");
        return null;
    }
}

function getWindDir(windDirection){
    let direction = parseInt(windDirection);
    if(direction <= 20) return 'North';
    if(direction <= 70) return 'North East';
    if(direction <= 110) return 'East';
    if(direction <= 160) return 'South East';
    if(direction <= 210) return 'South';
    if(direction <= 250) return 'South West';
    if(direction <= 290) return 'West';
    if(direction <= 340) return 'North West';
    if(direction <= 360) return 'North';
}

function getTimeZone(second) {
    let seconds = parseInt(second);
    const hours = Math.floor(Math.abs(seconds) / 3600);
    const minutes = Math.floor((Math.abs(seconds) % 3600) / 60);
    const sign = seconds < 0 ? '-' : '+';
    const timeZone = `GMT ${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return timeZone;
}
    
function addWeatherDataOnUI(location){
    document.getElementById('city').innerHTML += location.name;
    document.getElementById('windSpeed').innerHTML += location.wind.speed + ` kmph`;
    document.getElementById('humidity').innerHTML += location.main.humidity;
    document.getElementById('timeZone').innerHTML += getTimeZone(location.timezone);
    document.getElementById('pressure').innerHTML += location.main.pressure;
    document.getElementById('windDir').innerHTML += getWindDir(location.wind.deg);
    // document.getElementById('uvIndex').innerHTML += location.name;
    document.getElementById('feelsLike').innerHTML += `${Math.round(location.main.feels_like-273.15)}&deg C`;
}

async function getWeatherData(){
    try{
        const getLocation = await getUserLocation();
        locationLongs.innerHTML += getLocation.lng;
        locationLats.innerHTML += getLocation.lat;
        const locationSrc = `https://maps.google.com/maps?q=${getLocation.lat}, ${getLocation.lng}&z=15&output=embed`;
        locationFrame.setAttribute('src', locationSrc);
        const URL = `${baseURL}lat=${getLocation.lat}&lon=${getLocation.lng}&appid=${apiKey}`;
        const resonse = await fetch(URL, {method: 'GET'});
        const result = await resonse.json();
        addWeatherDataOnUI(result);
    }
    catch(error){
        console.log(error);
    }
}