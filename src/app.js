export default class App{

    constructor(){
        console.log('App constructor');
        this.hookEvents();
    }

    hookEvents(){
        document.addEventListener("DOMContentLoaded", function () {
            getLocation();
          });
          //position stuff
          const x = document.getElementById("demo");
          function getLocation() {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showPosition);
            } else {
              x.innerHTML = "Geolocation is not supported by this browser.";
            }
          }
        
          function showPosition(position) {
            const url = `https://api.tomtom.com/search/2/reverseGeocode/ ${position.coords.latitude},${position.coords.longitude}.json?key=4MAKRgV34urGA15sOxvIra7t1zKIG0MG&radius=100`
        
            fetch(url)
              .then(response => {
                if (response.ok) {
                  return response.json(); // Parse the JSON response
                } else {
                  throw new Error(`Request failed with status: ${response.status}`);
                }
              })
              .then(data => {
                // Process the data as needed
                let city = data['addresses'][0]['address']['municipality'];
                let country = data['addresses'][0]['address']['country'];
                console.log(data['addresses'][0]['address']);
                getWeather(position, city);
              })
              .catch(error => {
                console.error(`Error: ${error.message}`);
              });
          }
          function getWeather(position, city) {
            let weatherurl = `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&daily=temperature_2m_max,rain_sum&timezone=auto`;
            fetch(weatherurl)
              .then(response => {
                if (response.ok) {
                  return response.json(); // Parse the JSON response
                } else {
                  throw new Error(`Request failed with status: ${response.status}`);
                }
              })
              .then(data => {
                // Process the data as needed
                let weather = data;
                let rain = false;
                let chanceOfRainToday = weather['daily']['rain_sum'][0];
                let maxTempToday = weather['daily']['temperature_2m_max'][0];
                let chancePercent = chanceOfRainToday * 10;
                console.log(data);
                if (chancePercent > 50) {
                  rain = true;
                }
                let text = 'an error has appeared';
                let text2 = 'an error has appeared';
                let photourl = '';
                if(rain == true){
                  text = "<h1 class='addtext'>Rainy in " + city + "?</h1><h1></h1>";
                  text2 = "<h2 class='addtext2'> Netflix got you covered... </h2>"
                  photourl = "photos/rain.jpg";
                }
                else if(maxTempToday > 30){
                  text = "<h1 class='addtext'>Feeling thirsty? Taste the feeling...</h1>";
                  text2 = "<h2 class='addtext2'> With CocaCola® Belgium</h2>"
                  photourl = "photos/cola.jpg";
                }
                else{
                  text = "<h1 class='addtext'>Looking for something to do in " + city + "?</h1>";
                  text2 = "<h3 class='addtext2'> <a href='https://www.wattedoen.be'>wattedoen</a> got u covered!</h3>"
                  photourl = "photos/wattedoen.jpg";
                }
                document.getElementById("add").style.backgroundImage = "url(" + photourl + ")";
                document.getElementById("text").innerHTML = text;
                document.getElementById("text2").innerHTML = text2;
              })
              .catch(error => {
                console.error(`Error: ${error.message}`);
              });
          }
    }


}