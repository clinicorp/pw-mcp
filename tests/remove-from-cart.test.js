const { test, expect } = require('@playwright/test');
const { LoginPage, ProductsPage, CartPage } = require('../utils/page-objects');

test.describe('Remover do Carrinho', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Aguardar carregamento da página de produtos
    await page.waitForURL(/.*inventory\.html/);
    
    // Adicionar produto ao carrinho antes de cada teste
    const productsPage = new ProductsPage(page);
    await productsPage.addFirstProductToCart();
  });

  test('deve remover item do carrinho', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Verificar que há 1 item no carrinho
    const badgeCount = await productsPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);

    // Navegar para o carrinho
    await productsPage.goToCart();
    await page.waitForURL(/.*cart\.html/);

    // Verificar que há 1 item no carrinho
    await expect(cartPage.cartItems).toHaveCount(1);

    // Remover o item do carrinho
    await cartPage.removeFirstItem();

    // Verificar que o carrinho está vazio ou badge foi atualizado
    // O badge pode desaparecer ou o carrinho pode mostrar mensagem de vazio
    const itemsAfterRemoval = await cartPage.cartItems.count();
    expect(itemsAfterRemoval).toBe(0);
  });

  test('deve atualizar badge do carrinho após remover item', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Adicionar mais um produto ao carrinho
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    
    // Verificar que há 2 itens no carrinho
    let badgeCount = await productsPage.getCartBadgeCount();
    expect(badgeCount).toBe(2);

    // Navegar para o carrinho
    await productsPage.goToCart();
    await page.waitForURL(/.*cart\.html/);

    // Remover um item
    await cartPage.removeFirstItem();

    // Voltar para a página de produtos
    await cartPage.continueShoppingButton.click();
    await page.waitForURL(/.*inventory\.html/);

    // Verificar que o badge foi atualizado para 1
    badgeCount = await productsPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);
  });

  test('deve remover todos os itens e verificar carrinho vazio', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Navegar para o carrinho
    await productsPage.goToCart();
    await page.waitForURL(/.*cart\.html/);

    // Remover o item
    await cartPage.removeFirstItem();

    // Verificar que o carrinho está vazio
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(0);

    // Verificar que o badge não está mais visível (ou está em 0)
    await productsPage.goto();
    const badgeCount = await productsPage.getCartBadgeCount();
    expect(badgeCount).toBe(0);
  });
});

