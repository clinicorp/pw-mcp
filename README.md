# 🎭 Playwright Test Automation Framework

<div align="center">

![Playwright](https://img.shields.io/badge/Playwright-45.1.0-2EAD33?style=for-the-badge&logo=playwright)
![Node.js](https://img.shields.io/badge/Node.js-24.12.0-339933?style=for-the-badge&logo=node.js)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Framework moderno de automação de testes end-to-end para aplicações web**

[Documentação](#-documentação) • [Instalação](#-instalação-rápida) • [Exemplos](#-exemplos-de-uso) • [Boas Práticas](#-boas-práticas-e-padrões)

</div>

---

## 📖 Sobre o Playwright

**Playwright** é um framework de automação de testes end-to-end desenvolvido pela **Microsoft**, lançado em 2020. Ele permite testar aplicações web modernas de forma confiável, rápida e cross-browser.

### 🏢 Criado pela Microsoft

O Playwright foi desenvolvido pela equipe da Microsoft que anteriormente criou o **Puppeteer**. Lançado em janeiro de 2020, rapidamente se tornou uma das ferramentas mais populares para automação de testes.

### 📊 Estatísticas Impressionantes

- ⭐ **+65.000 stars** no GitHub ([microsoft/playwright](https://github.com/microsoft/playwright))
- 📦 **+10 milhões de downloads** semanais no npm
- 🌍 Usado por empresas como **Microsoft**, **Netflix**, **Adobe**, **Spotify**
- 🚀 Crescimento de **+200%** em adoção desde 2021
- 🔄 Atualizações mensais com novas funcionalidades

### ✨ Por que Playwright?

| Característica | Descrição |
|---------------|-----------|
| 🎯 **Multi-Browser** | Suporte nativo para Chromium, Firefox e WebKit (Safari) |
| ⚡ **Performance** | Execução paralela e automação inteligente de esperas |
| 🔒 **Confiabilidade** | Auto-waiting, retry automático e isolamento de testes |
| 🎨 **Developer Experience** | UI Mode, Codegen, Trace Viewer e Debugging avançado |
| 🌐 **Cross-Platform** | Windows, macOS e Linux |
| 📱 **Mobile Testing** | Emulação de dispositivos móveis |
| 🎬 **Video & Screenshot** | Gravação automática de vídeos e screenshots |
| 🔍 **Network Interception** | Mock de requisições e respostas |

---

## 🚀 Instalação Rápida

### Pré-requisitos

- **Node.js** v18+ (recomendado v24.12.0 LTS)
- **npm** ou **yarn**

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/clinicorp/pw-mcp.git
cd pw-mcp

# 2. Instale as dependências
npm install

# 3. Instale os browsers do Playwright
npx playwright install

# 4. Execute os testes
npm test
```

---

## 🎯 Sobre Este Projeto

Este projeto demonstra a implementação de testes automatizados usando **Playwright** para o site **Sauce Demo**, cobrindo os principais fluxos de uma aplicação e-commerce:

- ✅ Autenticação e login
- ✅ Gerenciamento de carrinho (adicionar/remover produtos)
- ✅ Fluxo completo de checkout
- ✅ Validações de interface e comportamento

### 🏗️ Arquitetura

```
pw-mcp/
├── tests/                      # Suite de testes
│   ├── login.test.js           # Testes de autenticação
│   ├── add-to-cart.test.js     # Testes de adicionar ao carrinho
│   ├── remove-from-cart.test.js # Testes de remover do carrinho
│   └── checkout.test.js        # Testes de checkout completo
├── utils/                       # Utilitários e helpers
│   ├── page-objects.js         # Page Object Model
│   └── urls.js                 # Gerenciamento de URLs
├── pages/                       # Snapshots HTML de referência
├── playwright.config.js         # Configuração do Playwright
└── package.json                 # Dependências do projeto
```

---

## 💻 TypeScript ou JavaScript?

O Playwright suporta **ambos** os idiomas nativamente! Escolha o que melhor se adequa ao seu projeto:

### JavaScript (Este Projeto)
```javascript
const { test, expect } = require('@playwright/test');

test('login test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.fill('[data-test="username"]', 'user');
  await expect(page.locator('[data-test="welcome"]')).toBeVisible();
});
```

### TypeScript
```typescript
import { test, expect } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.fill('[data-test="username"]', 'user');
  await expect(page.locator('[data-test="welcome"]')).toBeVisible();
});
```

**Vantagens do TypeScript:**
- ✅ Type safety e autocomplete melhorado
- ✅ Detecção de erros em tempo de desenvolvimento
- ✅ Melhor suporte em IDEs
- ✅ Refatoração mais segura

**Vantagens do JavaScript:**
- ✅ Mais simples e direto
- ✅ Sem necessidade de compilação
- ✅ Menos configuração inicial
- ✅ Ideal para prototipagem rápida

---

## 🎨 Boas Práticas e Padrões

### 🔍 Padrão Clinicorp: `data-testid`

Na **Clinicorp**, seguimos um padrão rigoroso e bem definido para o uso do atributo `data-testid` em todos os componentes frontend. Este padrão é **obrigatório** para elementos relevantes para automação de testes e facilita a manutenção e rastreabilidade.

### 📐 Diretrizes Gerais

#### 1. Obrigatoriedade
✅ **Todos os elementos relevantes para automação de testes devem conter o atributo `data-testid`.**

#### 2. Padrão de Nomenclatura

O valor do `data-testid` deve seguir o padrão:

```
[sigla do elemento]-[nome da tela ou funcionalidade]-[sigla do módulo]
```

**Exemplo:**
```html
<button data-testid="btn-schedule-ODO">Agendar</button>
```
- `btn` = sigla do elemento (Button)
- `schedule` = nome da funcionalidade (agendamento)
- `ODO` = sigla do módulo

#### 3. Elementos em Lista

Para elementos que aparecem em listas ou são renderizados múltiplas vezes, adicionar o **índice ao final**:

```html
<!-- Primeiro item -->
<button data-testid="btn-edit-ODO-1">Editar</button>

<!-- Segundo item -->
<button data-testid="btn-edit-ODO-2">Editar</button>
```

### 📋 Siglas Padronizadas de Elementos

| Elemento | Sigla | Exemplo |
|----------|-------|---------|
| Button | `btn` | `btn-save-PAC` |
| Label | `lbl` | `lbl-title-FIN` |
| Input | `txt` ou `inp` | `txt-search-PAC` |
| Select | `sel` | `sel-status-FOU` |
| Div | `div` | `div-container-ADM` |
| Span | `spn` | `spn-message-ODO` |
| Checkbox | `chk` | `chk-agree-PAC` |
| Radio | `rdo` | `rdo-option-FIN` |
| Link | `lnk` | `lnk-details-ODO` |
| Tabela | `tbl` | `tbl-users-ADM` |
| Linha | `row` | `row-patient-PAC` |
| Coluna | `col` | `col-name-FIN` |
| Ícone | `ico` | `ico-edit-ODO` |
| Modal | `mdl` | `mdl-confirm-PAC` |
| Card | `crd` | `crd-product-FOU` |
| Tooltip | `tip` | `tip-help-ADM` |
| Avatar | `avt` | `avt-user-FIN` |
| Badge | `bdg` | `bdg-status-ODO` |

### 💡 Exemplos Práticos

#### Botão de salvar em tela de cadastro do módulo PAC
```html
<button data-testid="btn-save-PAC">Salvar</button>
```

#### Input de busca na tela de pacientes do módulo PAC
```html
<input data-testid="inp-search-PAC" type="text" />
```

#### Label de título na tela de financeiro do módulo FIN
```html
<label data-testid="lbl-title-FIN">Financeiro</label>
```

#### Botão de editar em uma lista (índice 3) na tela de usuários do módulo ADM
```html
<button data-testid="btn-editar-ADM-3">Editar</button>
```

#### Select de status em tela de agendamento do módulo FOU
```html
<select data-testid="sel-status-FOU">
  <option value="active">Ativo</option>
  <option value="inactive">Inativo</option>
</select>
```

### 🎯 Uso no Playwright

```javascript
// Método recomendado: getByTestId()
await page.getByTestId('btn-save-PAC').click();
await page.getByTestId('inp-search-PAC').fill('João Silva');

// Alternativa: locator com data-testid
await page.locator('[data-testid="btn-save-PAC"]').click();
```

### 📝 Exemplo Prático com Page Object

```javascript
// Page Object usando padrão Clinicorp
class PacientePage {
  constructor(page) {
    this.page = page;
    // ✅ Seletores seguindo padrão Clinicorp
    this.searchInput = page.getByTestId('inp-search-PAC');
    this.saveButton = page.getByTestId('btn-save-PAC');
    this.titleLabel = page.getByTestId('lbl-title-PAC');
  }

  async buscarPaciente(nome) {
    await this.searchInput.fill(nome);
  }

  async salvar() {
    await this.saveButton.click();
  }
}
```

### ⚠️ Regras Importantes

1. ✅ **Sempre utilize nomes claros e objetivos** para a tela/funcionalidade
2. ✅ **Utilize siglas de módulo padronizadas** e documentadas
3. ❌ **Não utilize espaços ou caracteres especiais** no valor do `data-testid`
4. ✅ **Para componentes reutilizáveis**, permita a passagem do `data-testid` via props
5. ✅ **Documente novos padrões** ou exceções

### 🎯 Por que este Padrão é Importante?

| Benefício | Descrição |
|-----------|-----------|
| **Facilita Automação** | Testes mais robustos e fáceis de escrever |
| **Reduz Manutenção** | Seletores estáveis não quebram com mudanças de CSS |
| **Melhora Rastreabilidade** | Fácil identificar qual módulo/tela cada elemento pertence |
| **Padroniza Comunicação** | QAs e Devs falam a mesma "língua" |
| **Colaboração** | Desenvolvedores sabem quais elementos são testados |

### 🔄 Fluxos de Implementação

Na Clinicorp, o `data-testid` pode ser implementado em diferentes contextos:

1. **Bitcloud** - Componentes compartilhados
2. **Repositório DEV** - Componentes específicos do projeto
3. **Storybook** - Documentação de componentes
4. **React Components** - Props para passar `data-testid`

### 📚 Componentes Mapeados

Alguns componentes já foram mapeados com suporte a `data-testid`:

- `<C_ButtonIcon>` - Botão com ícone
- `<ButtonRC>` - Botão React Component
- `<C_ButtonFlat>` - Botão flat
- `<TextField>` - Campo de texto
- `<C_Search>` - Componente de busca
- `<TabContainer>` - Container de abas
- E outros...

---

### ❌ Evite Seletores Frágeis

```javascript
// ❌ RUIM: Seletores baseados em CSS podem quebrar facilmente
await page.click('.btn-primary'); // Quebra se mudar a classe CSS
await page.click('#submit-btn');  // Quebra se mudar o ID
await page.click('div > button'); // Muito genérico, pode selecionar elemento errado

// ✅ BOM: Use o padrão Clinicorp com data-testid
await page.getByTestId('btn-save-PAC').click();
```

---

## 🧪 Executando os Testes

### Comandos Principais

```bash
# Executar todos os testes em todos os browsers
npm test

# Executar em browser específico
npm run test:chromium   # Chrome/Edge
npm run test:firefox    # Firefox
npm run test:webkit     # Safari

# Modo interativo (UI Mode) - Recomendado para desenvolvimento
npm run test:ui

# Executar com browser visível
npm run test:headed

# Ver relatório HTML
npm run test:report
```

### Configurações de Velocidade

```bash
# Execução rápida (sem delay)
npm run test:fast

# Execução com delay para visualização (padrão)
npm test
```

---

## 🎭 Funcionalidades Testadas

### 1. 🔐 Autenticação
- Login com credenciais válidas
- Validação de credenciais inválidas
- Redirecionamento após login

### 2. 🛒 Gerenciamento de Carrinho
- Adicionar produtos ao carrinho
- Remover produtos do carrinho
- Atualização do badge do carrinho
- Validação de itens no carrinho

### 3. 💳 Checkout Completo
- Preenchimento de informações
- Validação de campos obrigatórios
- Revisão do pedido
- Confirmação de compra

---

## ⚙️ Configuração

### Multi-Browser Testing

Os testes são configurados para executar automaticamente em:

- 🌐 **Chromium** (Chrome, Edge, Opera)
- 🦊 **Firefox** (Mozilla)
- 🍎 **WebKit** (Safari)

### Slow Motion (Visualização)

Para facilitar a visualização durante desenvolvimento, os testes incluem `slowMo: 2000ms` (2 segundos de delay entre ações). Isso pode ser ajustado em `playwright.config.js`:

```javascript
launchOptions: {
  slowMo: 2000, // Ajuste conforme necessário (0 para execução rápida)
}
```

---

## 📚 Documentação

### Recursos Oficiais

- 📖 [Documentação Oficial](https://playwright.dev/)
- 🎓 [Guia de Início Rápido](https://playwright.dev/docs/intro)
- 🎬 [Exemplos e Tutoriais](https://playwright.dev/docs/test-examples)
- 🐛 [Troubleshooting](https://playwright.dev/docs/troubleshooting)

### Recursos da Comunidade

- 💬 [Discord da Comunidade](https://aka.ms/playwright/discord)
- 🐦 [Twitter @playwrightweb](https://twitter.com/playwrightweb)
- 📺 [YouTube Channel](https://www.youtube.com/c/Playwright)

---

## 🏆 Vantagens do Playwright

### Comparado a Selenium

| Característica | Playwright | Selenium |
|---------------|------------|----------|
| Velocidade | ⚡ Muito rápido | 🐌 Mais lento |
| Auto-waiting | ✅ Nativo | ❌ Manual |
| Multi-browser | ✅ Nativo | ⚠️ Requer drivers |
| API Moderna | ✅ Async/await | ⚠️ Callbacks |
| Debugging | ✅ Trace Viewer | ⚠️ Limitado |

### Comparado a Cypress

| Característica | Playwright | Cypress |
|---------------|------------|---------|
| Multi-browser | ✅ Chromium, Firefox, WebKit | ✅ Chrome, Edge, Firefox, WebKit* |
| Parallelização | ✅ Nativa (sem custos) | ⚠️ Requer Cypress Dashboard (pago) ou configuração manual |
| Mobile Testing | ✅ Emulação nativa | ⚠️ Limitada |
| Network Mock | ✅ Interceptação avançada | ✅ Interceptação (cy.intercept) |
| Execução | ✅ Headless e headed | ⚠️ Focado em desenvolvimento |
| Arquitetura | ✅ Fora do browser | ⚠️ Dentro do browser |
| Performance | ✅ ~2-4x mais rápido* | ⚠️ Mais lento devido à arquitetura |

*Baseado em benchmarks: Playwright executa testes aproximadamente 2-4x mais rápido que Cypress devido à sua arquitetura que interage diretamente com o DevTools Protocol, enquanto Cypress roda dentro do browser, introduzindo overhead adicional.

**Notas:**
- Cypress suporta múltiplos browsers, mas com algumas limitações em Firefox e WebKit comparado ao suporte completo do Playwright.
- Parallelização no Cypress: A parallelização nativa requer Cypress Dashboard Service (plano pago). Alternativas open-source existem, mas requerem configuração manual e não são tão robustas quanto a solução nativa do Playwright.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código

- Use `data-test` ou `data-testid` para seletores
- Siga o padrão Page Object Model
- Adicione comentários explicativos
- Mantenha os testes independentes e isolados

---

## 📊 Credenciais de Teste

Para executar os testes no Sauce Demo:

- **Username**: `standard_user`
- **Password**: `secret_sauce`

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Autores

Desenvolvido pela equipe **Clinicorp Engineering**

- 📧 Email: contato@clinicorp.com
- 🌐 Website: [www.clinicorp.com](http://www.clinicorp.com)
- 💼 LinkedIn: [Clinicorp](https://www.linkedin.com/company/clinicorp)

---

<div align="center">

**❤️ pwzin [Playwright](https://playwright.dev/)**

[⬆ Voltar ao topo](#-playwright-test-automation-framework)

</div>
