// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuração do Playwright para testes em múltiplos browsers
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  
  // Timeout para cada teste
  timeout: 30 * 1000,
  
  // Timeout para expect/assertions
  expect: {
    timeout: 5000
  },
  
  // Executar testes em paralelo
  fullyParallel: true,
  
  // Falhar a build se você deixou test.only no CI
  forbidOnly: !!process.env.CI,
  
  // Retry em CI apenas
  retries: process.env.CI ? 2 : 0,
  
  // Workers em CI, 1 localmente para debug
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter para usar
  reporter: 'html',
  
  // Configurações compartilhadas para todos os projetos
  use: {
    // URL base para usar em navegação como `await page.goto('/')`
    baseURL: 'https://www.saucedemo.com',
    
    // Coletar trace quando retentar o teste falho
    trace: 'on-first-retry',
    
    // Screenshot apenas quando falhar
    screenshot: 'only-on-failure',
    
    // Vídeo apenas quando falhar
    video: 'retain-on-failure',
    
    // Headless mode desabilitado para visualização durante desenvolvimento
    headless: false,
    
    // Slow motion: adiciona delay de 2 segundos entre ações para melhor visualização
    //launchOptions: {
     // slowMo: 2000,
    //},
  },

  // Configurar projetos para múltiplos browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // launchOptions: {
        //   slowMo: 2000,
        // },
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // launchOptions: {
        //   slowMo: 2000,
        // },
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // launchOptions: {
        //   slowMo: 2000,
        // },
      },
    },
  ],
});

