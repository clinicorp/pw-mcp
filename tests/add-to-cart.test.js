const { test, expect } = require('@playwright/test');
const { LoginPage, ProductsPage, CartPage } = require('../utils/page-objects');

test.describe('Adicionar ao Carrinho', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Aguardar carregamento da página de produtos
    await page.waitForURL(/.*inventory\.html/);
  });

  test('deve adicionar um produto ao carrinho', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    // Verificar que o badge do carrinho não está visível inicialmente
    const initialBadgeCount = await productsPage.getCartBadgeCount();
    expect(initialBadgeCount).toBe(0);

    // Adicionar o primeiro produto ao carrinho
    await productsPage.addFirstProductToCart();

    // Verificar que o badge do carrinho foi atualizado
    await expect(productsPage.shoppingCartBadge).toBeVisible();
    const badgeCount = await productsPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);
  });

  test('deve adicionar múltiplos produtos ao carrinho', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    // Adicionar primeiro produto
    await productsPage.addFirstProductToCart();
    
    // Adicionar segundo produto (se disponível)
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    const buttonCount = await addButtons.count();
    
    if (buttonCount > 1) {
      await addButtons.nth(1).click();
      
      // Verificar que o badge foi atualizado para 2
      const badgeCount = await productsPage.getCartBadgeCount();
      expect(badgeCount).toBe(2);
    }
  });

  test('deve verificar item no carrinho após adicionar', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Adicionar produto ao carrinho
    await productsPage.addFirstProductToCart();

    // Navegar para o carrinho
    await productsPage.goToCart();
    await page.waitForURL(/.*cart\.html/);

    // Verificar que o item está no carrinho
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartList).toBeVisible();
  });
});

