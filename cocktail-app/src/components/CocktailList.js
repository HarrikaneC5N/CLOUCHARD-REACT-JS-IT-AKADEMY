import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function CocktailList() {
    const { name } = useParams();
    const [cocktailDetails, setCocktailDetails] = useState(null);
    const [cocktailList, setCocktailList] = useState([]);

    const [previewCocktail, setPreviewCocktail] = useState(null);

    useEffect(() => {
        if (!name) {
            // Display all cocktails when name is not provided (home page)
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a`)
                .then(response => response.json())
                .then(data => {
                    setCocktailList(data.drinks);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        } else {
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`)
                .then(response => response.json())
                .then(data => {
                    setCocktailDetails(data.drinks[0]);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }, [name]);

    const handleMouseEnter = (cocktail) => {
        setPreviewCocktail(cocktail);
    };

    const handleMouseLeave = () => {
        setPreviewCocktail(null);
    };

    return (
        <div className="container mt-4">
            {name ? (
                <div>
                    {cocktailDetails ? (
                        <div>
                            <h2>{cocktailDetails.strDrink}</h2>
                            <img
                                src={cocktailDetails.strDrinkThumb}
                                alt={cocktailDetails.strDrink}
                                style={{ maxWidth: "200px" }}
                            />
                            <p>{cocktailDetails.strInstructions}</p>
                            {/* Add more cocktail details */}
                        </div>
                    ) : (
                        <p>Loading cocktail details...</p>
                    )}
                </div>
            ) : (
                <div className="row">
                    {cocktailList.map(cocktail => (
                        <div
                            className="col-lg-4 col-md-6 mb-4"
                            key={cocktail.idDrink}
                            onMouseEnter={() => handleMouseEnter(cocktail)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="card">
                                <img
                                    src={cocktail.strDrinkThumb}
                                    alt={cocktail.strDrink}
                                    className="card-img-top"
                                    style={{ maxHeight: "200px" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{cocktail.strDrink}</h5>
                                    {/* Add more cocktail details */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {previewCocktail && (
                <div className="card preview-card" style={{ width: "200px" }}>
                    <img
                        src={previewCocktail.strDrinkThumb}
                        alt={previewCocktail.strDrink}
                        className="card-img-top"
                        style={{ maxHeight: "200px" }}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{previewCocktail.strDrink}</h5>
                        {/* Add more cocktail details */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CocktailList;
