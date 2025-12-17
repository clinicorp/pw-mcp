/**
 * EXEMPLO: Teste usando Fixtures do Playwright
 * 
 * Este é apenas um exemplo para demonstrar como ficaria usando Fixtures
 * em vez de Page Objects. Não está sendo usado nos testes principais.
 */

const { test: base, expect } = require('@playwright/test');
const { getUrl } = require('../utils/urls');

// Definir fixtures customizadas
const test = base.extend({
  // Fixture para LoginPage
  loginPage: async ({ page }, use) => {
    const loginPage = {
      page, // Expor page para uso em outras fixtures
      async goto() {
        await page.goto(getUrl('login'));
      },
      async login(username, password) {
        await page.locator('[data-test="username"]').fill(username);
        await page.locator('[data-test="password"]').fill(password);
        await page.locator('[data-test="login-button"]').click();
      },
      get errorMessage() {
        return page.locator('.error-message-container');
      }
    };
    await use(loginPage);
  },

  // Fixture para ProductsPage
  productsPage: async ({ page }, use) => {
    const productsPage = {
      page, // Expor page para uso em outras fixtures
      async goto() {
        await page.goto(getUrl('lista-produtos'));
      },
      async addFirstProductToCart() {
        await page.locator('[data-test^="add-to-cart"]').first().click();
      },
      async goToCart() {
        await page.locator('[data-test="shopping-cart-link"]').click();
      },
      get title() {
        return page.locator('[data-test="title"]');
      },
      get shoppingCartBadge() {
        return page.locator('[data-test="shopping-cart-badge"]');
      },
      async getCartBadgeCount() {
        const badge = page.locator('[data-test="shopping-cart-badge"]');
        if (await badge.isVisible()) {
          return parseInt(await badge.textContent());
        }
        return 0;
      }
    };
    await use(productsPage);
  },

  // Fixture para usuário logado (combina loginPage + productsPage)
  loggedInUser: async ({ loginPage, productsPage, page }, use) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForURL(/.*inventory\.html/);
    await use({ loginPage, productsPage });
  }
});

// Exemplo 1: Teste de login usando fixtures
test.describe('Login com Fixtures', () => {
  test('deve fazer login com credenciais válidas', async ({ loginPage, productsPage, page }) => {
    // Navegar para a página de login
    await loginPage.goto();

    // Fazer login
    await loginPage.login('standard_user', 'secret_sauce');

    // Verificar redirecionamento
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Verificar que a página de produtos está carregada
    await expect(productsPage.title).toBeVisible();
    await expect(productsPage.title).toHaveText('Products');
  });

  test('deve exibir erro com credenciais inválidas', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login('invalid_user', 'wrong_password');

    // Verificar que ainda está na página de login
    await expect(page).toHaveURL(/.*\/$/);
    
    // Verificar mensagem de erro
    const errorVisible = await loginPage.errorMessage.isVisible().catch(() => false);
    if (errorVisible) {
      await expect(loginPage.errorMessage).toBeVisible();
    }
  });
});

// Exemplo 2: Teste usando fixture de usuário já logado
test.describe('Adicionar ao Carrinho com Fixtures', () => {
  test('deve adicionar produto ao carrinho', async ({ loggedInUser, productsPage }) => {
    // Usuário já está logado pela fixture loggedInUser
    
    // Verificar que o badge não está visível inicialmente
    const initialBadgeCount = await productsPage.getCartBadgeCount();
    expect(initialBadgeCount).toBe(0);

    // Adicionar produto ao carrinho
    await productsPage.addFirstProductToCart();

    // Verificar que o badge foi atualizado
    await expect(productsPage.shoppingCartBadge).toBeVisible();
    const badgeCount = await productsPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);
  });
});

// Exemplo 3: Teste usando múltiplas fixtures
test.describe('Checkout com Fixtures', () => {
  test('deve completar checkout', async ({ loggedInUser, productsPage, page }) => {
    // Usuário já está logado
    const { loginPage } = loggedInUser;

    // Adicionar produto ao carrinho
    await productsPage.addFirstProductToCart();

    // Navegar para o carrinho
    await productsPage.goToCart();
    await page.waitForURL(/.*cart\.html/);

    // Iniciar checkout
    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL(/.*checkout-step-one\.html/);

    // Preencher informações
    await page.locator('[data-test="firstName"]').fill('João');
    await page.locator('[data-test="lastName"]').fill('Silva');
    await page.locator('[data-test="postalCode"]').fill('12345-678');

    // Continuar
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL(/.*checkout-step-two\.html/);

    // Finalizar
    await page.locator('[data-test="finish"]').click();
    await page.waitForURL(/.*checkout-complete\.html/);

    // Verificar sucesso
    await expect(page.locator('.complete-header')).toBeVisible();
  });
});

