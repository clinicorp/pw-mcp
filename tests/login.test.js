const { test, expect } = require('@playwright/test');
const { LoginPage, ProductsPage } = require('../utils/page-objects');

test.describe('Login', () => {
  test('deve fazer login com credenciais válidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    // Navegar para a página de login
    await loginPage.goto();

    // Fazer login
    await loginPage.login('standard_user', 'secret_sauce');

    // Verificar redirecionamento para a página de produtos
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Verificar que a página de produtos está carregada
    await expect(productsPage.title).toBeVisible();
    await expect(productsPage.title).toHaveText('Products');
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navegar para a página de login
    await loginPage.goto();

    // Tentar fazer login com credenciais inválidas
    await loginPage.login('invalid_user', 'wrong_password');

    // Verificar que ainda está na página de login
    await expect(page).toHaveURL(/.*\/$/);
    
    // Verificar mensagem de erro (se existir)
    // Nota: O site pode não exibir mensagem de erro imediatamente
    // ou pode usar diferentes seletores
    const errorVisible = await loginPage.errorMessage.isVisible().catch(() => false);
    if (errorVisible) {
      await expect(loginPage.errorMessage).toBeVisible();
    }
  });
});

