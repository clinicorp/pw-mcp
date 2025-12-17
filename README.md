# Testes Automatizados com Playwright

Suite de testes automatizados para o site Sauce Demo usando Playwright, executando em múltiplos browsers (Chromium, Firefox e WebKit/Safari).

## Pré-requisitos

- Node.js v24.12.0 ou superior
- npm ou yarn

## Instalação

1. Instalar as dependências:
```bash
npm install
```

2. Instalar os browsers do Playwright:
```bash
npx playwright install
```

## Estrutura do Projeto

```
pw-mcp/
├── tests/                    # Arquivos de teste
│   ├── login.test.js        # Testes de login
│   ├── add-to-cart.test.js  # Testes de adicionar ao carrinho
│   ├── remove-from-cart.test.js  # Testes de remover do carrinho
│   └── checkout.test.js     # Testes de checkout completo
├── utils/                    # Utilitários
│   ├── urls.js              # Leitura do urls.yaml
│   └── page-objects.js      # Page Objects para reutilização
├── pages/                    # Snapshots HTML das páginas
├── urls.yaml                 # URLs das páginas
├── playwright.config.js      # Configuração do Playwright
└── package.json              # Dependências do projeto
```

## Executando os Testes

### Executar todos os testes em todos os browsers
```bash
npm test
```

### Executar em um browser específico
```bash
npm run test:chromium   # Apenas Chromium
npm run test:firefox    # Apenas Firefox
npm run test:webkit     # Apenas WebKit (Safari)
```

### Modo interativo (UI Mode)
```bash
npm run test:ui
```

### Modo headed (com browser visível)
```bash
npm run test:headed
```

### Ver relatório HTML
```bash
npm run test:report
```

### Executar com diferentes velocidades
```bash
npm test          # Com delay de 2 segundos entre ações (padrão)
npm run test:slow # Com delay de 2 segundos (explícito)
npm run test:fast # Sem delay (execução rápida)
```

## Fluxos Testados

1. **Login**: Teste de login com credenciais válidas e inválidas
2. **Adicionar ao Carrinho**: Adicionar produtos ao carrinho e verificar badge
3. **Remover do Carrinho**: Remover itens do carrinho e verificar atualização
4. **Checkout Completo**: Fluxo completo de checkout desde o carrinho até a confirmação

## Credenciais de Teste

- **Username**: `standard_user`
- **Password**: `secret_sauce`

## Configuração

Os testes são configurados para executar em três browsers em paralelo:
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

A configuração pode ser ajustada no arquivo `playwright.config.js`.

### Delay entre ações (Slow Motion)

Por padrão, os testes estão configurados com `slowMo: 2000` (2 segundos de delay entre cada ação) para facilitar a visualização durante a execução. Isso permite acompanhar melhor cada passo dos testes.

Para ajustar o delay:
- Edite `slowMo` no arquivo `playwright.config.js` (valor em milissegundos)
- Use `npm run test:fast` para executar sem delay
- Use `npm run test:slow` para executar com delay de 2 segundos

## Page Objects

O projeto utiliza o padrão Page Object Model para melhor organização e reutilização de código. Os Page Objects estão em `utils/page-objects.js`.

## Relatórios

Após a execução dos testes, um relatório HTML é gerado automaticamente. Para visualizar:

```bash
npm run test:report
```

