import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
    const apiKey = "ffb5e80f3d4c4a1f3c43f80a1f43efbb"; // Replace with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;

    const cities = [
        { name: "Paris" },
        { name: "Tokyo" },
        { name: "Reykjavik" }
    ];

    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const dataPromises = cities.map(city => {
                const cityApiUrl = `${apiUrl}${city.name}&appid=${apiKey}`;
                return fetch(cityApiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Network response was not ok for ${city.name}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        return { city: city.name, data };
                    });
            });

            Promise.all(dataPromises)
                .then(cityData => {
                    setWeatherData(cityData);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        };

        fetchData();
    }, [apiKey, apiUrl]);

    return (
        <div className="App">
            <header className="App-header">
                <div className="row">
                    {loading ? (
                        <div className="loader"></div>
                    ) : (
                        weatherData.map(({ city, data }) => (
                            <div className="col-md-4" key={city}>
                                <h1>Météo actuelle à {city}</h1>
                                <p>Temperature: {Math.round(data.main.temp - 273.15)} °C</p>
                                <p>Météo : {data.weather[0].description}</p>
                                <p>Vitesse du vent : {data.wind.speed} m/s</p>
                                <p>Humidité : {data.main.humidity}%</p>
                            </div>
                        ))
                    )}
                </div>
            </header>
        </div>
    );
}

export default App;
