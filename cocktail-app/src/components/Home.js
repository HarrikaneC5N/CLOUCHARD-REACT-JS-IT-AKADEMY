import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [name, setName] = useState('');
    const [randomCocktails, setRandomCocktails] = useState([]);
    const [searchedCocktails, setSearchedCocktails] = useState([]);

    useEffect(() => {
        // je fetch 9 cocktail au pif
        const fetchData = async () => {
            const promises = [];

            for (let i = 0; i < 9; i++) {
                promises.push(fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
                    .then(response => response.json())
                    .then(data => data.drinks[0]));
            }

            Promise.all(promises)
                .then(cocktails => {
                    setRandomCocktails(cocktails);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (name) {
            // Fetch cocktails based on the search query
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`)
                .then(response => response.json())
                .then(data => {
                    setSearchedCocktails(data.drinks);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        } else {
            // Clear the searched cocktails when there's no search query
            setSearchedCocktails([]);
        }
    }, [name]);

    return (
        <div>
            <input
                type="text"
                placeholder="Enter cocktail name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {searchedCocktails.length > 0 ? (
                <ul>
                    {searchedCocktails.map(cocktail => (
                        <li key={cocktail.idDrink}>
                            <Link to={`/cocktails/${cocktail.strDrink}`}>{cocktail.strDrink}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                randomCocktails.map((cocktail, index) => (
                    index % 3 === 0 && <div key={index} className="row">
                        {randomCocktails.slice(index, index + 3).map((cocktail, subIndex) => (
                            <div key={subIndex} className="col-md-4">
                                <div className="card mb-3">
                                    <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} className="card-img-top" />
                                    <div className="card-body">
                                        <h5 className="card-title">{cocktail.strDrink}</h5>
                                        <p className="card-text">{cocktail.strAlcoholic}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
