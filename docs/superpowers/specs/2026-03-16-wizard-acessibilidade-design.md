# Design: Refatoração para Acessibilidade — Wizard Passo a Passo

**Data:** 2026-03-16
**Projeto:** Harvest Calc Pro
**Status:** Aprovado

---

## Contexto

O Harvest Calc Pro é uma calculadora de pagamento de corte de cana usada por produtores rurais. O layout atual foi projetado sem considerar o perfil real do usuário final.

**Perfil do usuário real:**
- Produtor rural idoso, semi-analfabeto
- Usa o app sozinho com a esposa no celular (smartphone)
- Usa o app no campo, ao ar livre (luz solar direta)
- Auxílio técnico disponível apenas nos fins de semana
- Fluxo de uso: calcula → lê o resultado → faz o pagamento

**Problemas do layout atual:**
- Tudo numa tela só: sobrecarrega cognitivamente o usuário
- Fonte pequena (14–16px): difícil de ler ao sol e para idosos
- Radio buttons pequenos: alvo de toque inadequado
- Jargão técnico ("Cubagem"): incompreensível para o público
- Timer de 60s apaga o resultado: pode sumir antes de anotar
- Lados A/B/C/D sem referência visual: o usuário não sabe qual lado medir
- Visualização SVG do terreno: desnecessária e confusa

---

## Solução: Wizard Passo a Passo com Diagrama Interativo

Substituir a página única por um fluxo guiado onde cada tela faz **uma única pergunta**, com diagrama visual destacando o lado a medir.

### Fluxo — Retângulo (7 telas)

| Passo | Tela | Conteúdo |
|-------|------|----------|
| 1 | Escolha da forma | Dois botões grandes com ícone SVG: RETÂNGULO / TRIÂNGULO |
| 2 | Lado de cima (A) | Diagrama com topo destacado + input único |
| 3 | Lado esquerdo (B) | Diagrama com esquerda destacada + input único |
| 4 | Lado de baixo (C) | Diagrama com base destacada + input único |
| 5 | Lado direito (D) | Diagrama com direita destacada + input único |
| 6 | Pagamento | Toneladas cortadas + Valor por tonelada (%) |
| 7 | Resultado | Tela cheia verde com valor em destaque |

### Fluxo — Triângulo (6 telas)

Igual ao retângulo, sem o passo 5 (Lado D).

---

## Design das Telas

### Tela 1 — Escolha da Forma

- Header verde com título "Como é o seu terreno?"
- Indicador de progresso: barra com 3 segmentos (passo 1 de 3 agrupado)
- Dois botões em coluna, altura mínima 100px cada:
  - Ícone SVG da forma (grande, ~60px)
  - Label em caixa alta: "RETÂNGULO" / "TRIÂNGULO"
  - Subtexto: "Terreno com 4 lados" / "Terreno com 3 lados"
- Botão selecionado: borda verde grossa + fundo verde claro
- Botão "PRÓXIMO →" fixo na base

### Telas 2–5 — Medidas dos Lados

- Header verde com indicador de progresso (3 segmentos: **Forma / Medidas / Pagamento**) e lembrete da forma escolhida
- Diagrama SVG do terreno com **o lado atual destacado em laranja/amarelo**
- Pergunta em linguagem simples: "Qual é a medida do lado de cima?"
- Input único, grande (altura 64px, fonte 28px), tipo numérico, unidade "m" à direita
- Botões: "← Voltar" (secundário) + "PRÓXIMO →" (primário verde)
- Validação ao avançar: valor deve ser maior que zero. Mensagem: "Digite um número maior que zero"

### Tela 6 — Pagamento

- Dois campos em coluna única:
  - "Quantas toneladas foram cortadas?" — input numérico inteiro
  - "Qual é o valor por tonelada? (%)" — input com "%" à direita, hint: "Ex: 20 para 20%"
    - O hook `usePercentageInput` existente já gerencia a conversão: o usuário digita `20`, o estado interno armazena `0.20`. Esse contrato deve ser mantido.
- Botão "🧮 CALCULAR" em verde, tamanho grande
- Botão "← Voltar" acima

### Tela 7 — Resultado

- Fundo verde escuro (`#1B5E20`) cobrindo a tela inteira
- "✅ Cálculo concluído" em texto pequeno
- "VALOR A PAGAR" como label
- Valor em **R$ XX.XXX,XX** — fonte 48px, branco, bold
- Card resumo (fundo semi-transparente):
  - Área: XXX m²
  - Toneladas: X
  - Taxa: X%
- Botão "🔄 NOVO CÁLCULO" em branco com texto verde
- **Sem timer** — resultado permanece até o usuário iniciar novo cálculo

---

## Padrões de Design (todas as telas)

### Tipografia
- Body mínimo: **20px**
- Labels de campos: **18px bold**
- Valores nos inputs: **26–28px**
- Resultado final: **48px bold**
- Subtextos/hints: 15px, cor cinza

### Interação
- Inputs: tipo `inputmode="numeric"` para abrir teclado numérico no celular
- Altura mínima de inputs: **60px**
- Altura mínima de botões: **56px**
- Botão primário: fundo `#2E7D32`, texto branco, border-radius 12px
- Botão secundário (Voltar): texto cinza, sem fundo

### Acessibilidade
- Contraste mínimo 4.5:1 em todos os textos
- Nenhum elemento depende apenas de cor para comunicar estado
- Linguagem simples: sem "cubagem", sem "retorno", sem termos técnicos

### Cores (mantidas do tema atual)
- Verde primário: `#2E7D32`
- Verde claro: `#4CAF50`
- Verde escuro: `#1B5E20`
- Destaque de lado ativo: `#FF6F00` (laranja)

---

## Arquitetura de Componentes

### Estrutura proposta

```
src/components/calculator/
  wizard/
    WizardContainer.tsx       ← gerencia estado e navegação entre passos
    steps/
      ShapeStep.tsx           ← passo 1: escolha da forma
      SideMeasureStep.tsx     ← passos 2–5: medida de um lado (reutilizável)
      PaymentStep.tsx         ← passo 6: toneladas e percentual
      ResultStep.tsx          ← passo 7: resultado final
    components/
      ShapeSelector.tsx       ← botões de forma com ícone SVG
      SideDiagram.tsx         ← SVG do terreno com lado destacado
      ProgressBar.tsx         ← barra de progresso do wizard
      WizardNavigation.tsx    ← botões Voltar / Próximo
```

### Estado do Wizard

```typescript
type WizardState = {
  shape: 'rectangle' | 'triangle' | null;
  sides: {
    a: number | null;
    b: number | null;
    c: number | null;
    d: number | null; // null para triângulo
  };
  payment: {
    toneladas: number | null;
    valorPorTonelada: number | null;
  };
  result: {
    area: number;
    valorTotal: number;
  } | null;
};
```

### Lógica de Cálculo

Mantida sem alteração nos hooks existentes (`useAreaCalculations`). Apenas o gatilho muda: o cálculo ocorre ao submeter o passo 6, não há timer de reset.

---

## O que Muda vs. O que Permanece

### Removido
- Componente único `CalculadoraCorteCana.tsx` (substituído pelo wizard)
- Visualização SVG estática do terreno (substituída pelo `SideDiagram` interativo)
- Timer de 60 segundos que apaga o resultado
- Radio buttons do Chakra UI para seleção de forma
- Layout de grid 2x2 para inputs de lados
- Palavra "Cubagem" em qualquer parte da UI

### Mantido
- Stack tecnológico: React + Chakra UI + TypeScript
- Lógica de cálculo existente (`useAreaCalculations`, `usePercentageInput`)
- Paleta de cores verde
- PWA e service worker
- Testes existentes (serão adaptados para nova estrutura — cada novo componente de passo deve ter teste de renderização e de navegação; a lógica de cálculo já está coberta pelos testes de hooks existentes)
- Validações existentes (`validation.ts`)

---

## Critérios de Sucesso

- Usuário consegue completar o cálculo sem ajuda externa
- Nenhum campo sem indicação visual de qual lado medir
- Resultado visível sem limite de tempo
- Todos os textos legíveis ao sol (contraste > 4.5:1, fonte ≥ 20px)
- Teclado numérico abre automaticamente em todos os campos de medida
- Fluxo funciona 100% em tela mobile (375px+)
