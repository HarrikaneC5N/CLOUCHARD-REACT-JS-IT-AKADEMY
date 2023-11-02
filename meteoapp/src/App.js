import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
    const apiKey = "ffb5e80f3d4c4a1f3c43f80a1f43efbb"; // Replace with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/`;
    const defaultCities = [
        { name: "Paris" },
        { name: "Tokyo" },
        { name: "Reykjavik" }
    ];

    const [userWeather, setUserWeather] = useState(null);
    const [defaultWeather, setDefaultWeather] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userLocation = await getUserLocation();
                const userCityData = await fetchCityWeather(userLocation.latitude, userLocation.longitude);

                const defaultCityPromises = defaultCities.map(city =>
                    fetchCityWeatherByName(city.name)
                );

                const defaultCityData = await Promise.all(defaultCityPromises);

                setUserWeather(userCityData);
                setDefaultWeather(defaultCityData);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.error("Error getting user location:", error);
                        reject("Could not retrieve user location");
                    }
                );
            } else {
                console.error("Geolocation not supported.");
                reject("Geolocation not supported");
            }
        });
    };

    const fetchCityWeather = (latitude, longitude) => {
        const userApiUrl = `${apiUrl}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        return fetch(userApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            });
    };

    const fetchCityWeatherByName = (cityName) => {
        const cityApiUrl = `${apiUrl}weather?q=${cityName}&appid=${apiKey}`;
        return fetch(cityApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${cityName}`);
                }
                return response.json();
            });
    };

    return (
        <div className="App">
            <header className="App-header">
                {loading ? (
                    <div className="loader"></div>
                ) : (
                    <div className="row">
                        {userWeather && (
                            <div className="col-md-12">
                                <h1>Météo actuelle à {userWeather.name}</h1>
                                <p>Temperature: {Math.round(userWeather.main.temp - 273.15)} °C</p>
                                <p>Météo : {userWeather.weather[0].description}</p>
                                <p>Vitesse du vent : {userWeather.wind.speed} m/s</p>
                                <p>Humidité : {userWeather.main.humidity}%</p>
                            </div>
                        )}
                        {defaultWeather.map((cityData, index) => (
                            <div className="col-md-4" key={index}>
                                <h1>Météo actuelle à {cityData.name}</h1>
                                <p>Temperature: {Math.round(cityData.main.temp - 273.15)} °C</p>
                                <p>Météo : {cityData.weather[0].description}</p>
                                <p>Vitesse du vent : {cityData.wind.speed} m/s</p>
                                <p>Humidité : {cityData.main.humidity}%</p>
                            </div>
                        ))}
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;

