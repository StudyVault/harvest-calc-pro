import './styles/global.css';
import CalculadoraCorteCana from './components/calculator/CalculadoraCorteCana';
import './App.css';
import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { usePWAUpdate } from './hooks/usePWAUpdate';

function App() {
  const toast = useToast();

  const showUpdateNotification = useCallback(() => {
    toast({
      title: '🚀 Nova versão disponível!',
      description: 'Uma atualização está pronta com melhorias e correções.',
      status: 'info',
      duration: null,
      isClosable: true,
      position: 'top',
      variant: 'top-accent',
      containerStyle: {
        zIndex: 9999,
      },
      render: ({ onClose }) => (
        <div
          style={{
            background: '#3182ce',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '400px',
            margin: '16px',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            🚀 Nova versão disponível!
          </div>
          <div style={{ marginBottom: '12px', fontSize: '14px' }}>
            Uma atualização está pronta com melhorias e correções.
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Depois
            </button>
            <button
              onClick={() => {
                updateApp();
                onClose();
              }}
              style={{
                background: 'white',
                border: 'none',
                color: '#3182ce',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
              }}
            >
              Atualizar Agora
            </button>
          </div>
        </div>
      ),
    });
  }, [toast]);

  const { updateApp } = usePWAUpdate(showUpdateNotification);

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
