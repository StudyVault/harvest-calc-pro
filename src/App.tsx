import './styles/global.css';
import CalculadoraCorteCana from './components/calculator/CalculadoraCorteCana';
import './App.css';

function App() {
  // Log de deploy para verificar atualizações
  const deployTimestamp = new Date().toLocaleString('pt-BR');
  const packageVersion = '1.2.0'; // Atualize sempre que fizer deploy
  const deployInfo = {
    timestamp: deployTimestamp,
    version: packageVersion,
    url: 'https://studyvault.github.io/harvest-calc-pro/',
    build: 'DEPLOY-TEST-' + Date.now(),
    environment: 'production',
    lastUpdate: '28/05/2025 - 21:35' // TESTE CRÍTICO - Mudança no GitHub Pages API
  };

  console.log('🚀 APP ATUALIZADO!');
  console.log('📍 URL Correta:', deployInfo.url);
  console.log('📅 Deploy realizado em:', deployInfo.timestamp);
  console.log('🔧 Versão:', deployInfo.version);
  console.log('📝 Última atualização:', deployInfo.lastUpdate);
  console.log('🏗️ Build ID:', deployInfo.build);
  console.log('🌍 Ambiente:', deployInfo.environment);
  console.log('===================================');

  // Log adicional para verificar se está no ambiente correto
  if (window.location.hostname === 'studyvault.github.io') {
    console.log('✅ CONFIRMADO: Executando no GitHub Pages correto!');
    console.log('🔗 URL atual:', window.location.href);
  } else if (window.location.hostname === 'localhost') {
    console.log('🔧 DESENVOLVIMENTO: Executando localmente');
    console.log('🔗 URL atual:', window.location.href);
  } else {
    console.log('⚠️ ATENÇÃO: Não está no GitHub Pages correto!');
    console.log('🔗 URL atual:', window.location.href);
    console.log('📝 Esperado: https://studyvault.github.io/harvest-calc-pro/');
  }
  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img src="./logo.svg" alt="Logo" className="logo" />
          </div>
          <h1 className="main-title">🔄 Harvest Calc Pro - DEPLOY EM TESTE 🔄</h1>
          <p className="subtitle">Calculadora Profissional para Corte de Cana - VERSÃO TESTE</p>
          <div className="deploy-info">
            <span className="deploy-badge">
              🚀 v{deployInfo.version} | Atualizado: {deployInfo.lastUpdate} | USANDO GITHUB PAGES API ✅
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
          v{deployInfo.version} | Build: {deployInfo.build} | {deployInfo.timestamp}
        </p>
      </footer>
    </div>
  );
}

export default App;