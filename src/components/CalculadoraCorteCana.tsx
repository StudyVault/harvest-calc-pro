import React, { useState } from 'react';
import './CalculadoraCorteCana.css';

const CalculadoraCorteCana: React.FC = () => {
  const [valores, setValores] = useState({
    toneladas: 0,
    valorPorTonelada: 0,
    ladoA: 0,
    ladoB: 0,
    ladoC: 0,
    ladoD: 0
  });

  const [resultado, setResultado] = useState({
    valorTotal: 0,
    areaTotal: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValores(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calcularPagamento = () => {
    const areaRetangulo = valores.ladoA * valores.ladoB;
    const s = (valores.ladoA + valores.ladoB + valores.ladoC) / 2;
    const areaTriangulo = Math.sqrt(
      s * (s - valores.ladoA) * (s - valores.ladoB) * (s - valores.ladoC)
    );
    
    const areaTotal = areaRetangulo + areaTriangulo;
    const valorTotal = valores.toneladas * valores.valorPorTonelada;

    setResultado({
      areaTotal,
      valorTotal
    });
  };

  return (
    <div className="container">
      <h1>Calculadora de Pagamento de Corte de Cana</h1>

      <div className="shapes-container">
        <div className="shape">
          <h3>Retângulo:</h3>
          <div className="rectangle">
            <div className="dimension-label top">A={valores.ladoA}m</div>
            <div className="dimension-label left">B={valores.ladoB}m</div>
            <div className="dimension-label bottom">C={valores.ladoC}m</div>
            <div className="dimension-label right">D={valores.ladoD}m</div>
          </div>
        </div>

        <div className="shape">
          <h3>Triângulo:</h3>
          <div className="triangle-container">
            <svg 
              viewBox="0 0 300 300" 
              className="triangle-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Triângulo base com preenchimento */}
              <path
                d="M 150,50 L 50,250 L 250,250 Z"
                className="triangle-path"
              />
              
              {/* Labels */}
              <g className="triangle-labels">
                {/* Label A - lado esquerdo */}
                <foreignObject x="60" y="120" width="80" height="30">
                  <div className="svg-label">A={valores.ladoA}m</div>
                </foreignObject>

                {/* Label B - base */}
                <foreignObject x="110" y="250" width="80" height="30">
                  <div className="svg-label">B={valores.ladoB}m</div>
                </foreignObject>

                {/* Label C - lado direito */}
                <foreignObject x="160" y="120" width="80" height="30">
                  <div className="svg-label">C={valores.ladoC}m</div>
                </foreignObject>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="form-container">
        <div className="form-group">
          <label htmlFor="toneladas">Quantidade de Toneladas:</label>
          <input
            id="toneladas"
            type="number"
            name="toneladas"
            value={valores.toneladas}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="valorPorTonelada">Valor por Tonelada (R$):</label>
          <input
            id="valorPorTonelada"
            type="number"
            name="valorPorTonelada"
            value={valores.valorPorTonelada}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ladoA">Lado A (metros):</label>
          <input
            id="ladoA"
            type="number"
            name="ladoA"
            value={valores.ladoA}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ladoB">Lado B (metros):</label>
          <input
            id="ladoB"
            type="number"
            name="ladoB"
            value={valores.ladoB}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ladoC">Lado C (metros):</label>
          <input
            id="ladoC"
            type="number"
            name="ladoC"
            value={valores.ladoC}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ladoD">Lado D (metros):</label>
          <input
            id="ladoD"
            type="number"
            name="ladoD"
            value={valores.ladoD}
            onChange={handleInputChange}
          />
        </div>

        <button className="calculate-button" onClick={calcularPagamento}>
          Calcular
        </button>

        {resultado.valorTotal > 0 && (
          <div className="resultado">
            <h3>Resultados:</h3>
            <p>Área Total: {resultado.areaTotal.toFixed(2)} m²</p>
            <p>Valor Total: R$ {resultado.valorTotal.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculadoraCorteCana; 