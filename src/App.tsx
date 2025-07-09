import './styles/global.css';
import CalculadoraCorteCana from './components/calculator/CalculadoraCorteCana';
import { usePWAUpdate } from './hooks/usePWAUpdate';
import { useEffect, useState } from 'react';

function App() {
  // Data e hora fixa da última atualização
  const buildDateTime = '28/05/2025 - 14:30'; // Data e hora do build/atualização

  const deployInfo = {
    version: '1.3.0',
    lastUpdate: buildDateTime
  };

  // Hook para detectar atualização do PWA
  const { updateAvailable } = usePWAUpdate();
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setShowUpdate(true);
    }
  }, [updateAvailable]);

  return (
    <div className="App">
      {showUpdate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          background: '#ffecb3',
          color: '#333',
          padding: '16px',
          textAlign: 'center',
          zIndex: 9999,
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          Uma nova versão está disponível!<br />
          Feche e abra o app para atualizar.
        </div>
      )}
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img src="./logo.svg" alt="Logo" className="logo" />
          </div>
          <h1 className="main-title">Harvest Calc Pro</h1>
          <p className="subtitle">Calculadora Profissional para Corte de Cana</p>
          <div className="deploy-info">
            <span className="deploy-badge">
              🚀 v{deployInfo.version} | Atualizado: {deployInfo.lastUpdate}
            </span>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <CalculadoraCorteCana />
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 Harvest Calc Pro. Todos os direitos reservados.</p>
        <p className="version-info">
          v{deployInfo.version} | {deployInfo.lastUpdate}
        </p>
      </footer>
    </div>
  );
}

export default App;