import React from 'react';
import './styles/global.css';
import CalculadoraCorteCana from './components/calculator/CalculadoraCorteCana';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <a href="/" className="logo">Harvest Calc Pro</a>
        </div>
      </header>
      
      <main className="main-content">
        <CalculadoraCorteCana />
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Harvest Calc Pro - Calculadora de Corte de Cana</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
