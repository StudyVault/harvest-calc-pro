# Calculadora de Corte de Cana

Uma aplicação web desenvolvida em React + Vite para calcular áreas e valores de corte de cana, considerando formas geométricas como retângulos e triângulos.

## Funcionalidades

- Cálculo de área de retângulos e triângulos
- Visualização interativa das formas geométricas
- Cálculo automático de valores baseado em toneladas e preço por tonelada
- Interface responsiva e amigável

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- CSS Moderno
- SVG para gráficos vetoriais

## Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/harvest-calc-pro.git
```

2. Instale as dependências:
```bash
cd harvest-calc-pro
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

4. Para build de produção:
```bash
npm run build
```

5. Para preview do build:
```bash
npm run preview
```

## Estrutura do Projeto

```
src/
  ├── components/        # Componentes React
  ├── App.tsx           # Componente principal
  ├── main.tsx          # Ponto de entrada
  └── styles/           # Arquivos CSS
```

## Deploy

Este projeto está configurado para deploy automático no GitHub Pages. Para configurar:

1. No GitHub, vá para Settings > Pages
2. Em "Source", selecione "GitHub Actions"
3. Faça um push para a branch main e o deploy será automático

O site estará disponível em `https://seu-usuario.github.io/harvest-calc-pro`

## Como Contribuir

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
