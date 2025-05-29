import './styles/global.css';
import CalculadoraCorteCana from './components/calculator/CalculadoraCorteCana';

function App() {
  // Gera automaticamente a data e hora atual
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' -');
  };

  const deployInfo = {
    version: '1.2.1',
    lastUpdate: getCurrentDateTime()
  };

  return (
    <div className="App">
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