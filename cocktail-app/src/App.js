// src/components/App.js uniquement pour le routage
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import CocktailList from './components/CocktailList';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cocktails/:name" element={<CocktailList />} />
            </Routes>
        </Router>
    );
}

export default App;
