const { test, expect } = require('@playwright/test');
const { 
  LoginPage, 
  ProductsPage, 
  CartPage, 
  CheckoutStepOnePage,
  CheckoutStepTwoPage,
  CheckoutCompletePage 
} = require('../utils/page-objects');

test.describe('Checkout Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Aguardar carregamento da página de produtos
    await page.waitForURL(/.*inventory\.html/);
    
    // Adicionar produto ao carrinho
    const productsPage = new ProductsPage(page);
    await productsPage.addFirstProductToCart();
  });

  test('deve completar checkout completo com sucesso', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    // Navegar para o carrinho
    await productsPage.goToCart();
    await page.waitForURL(/.*cart\.html/);

    // Verificar que há itens no carrinho
    await expect(cartPage.cartItems).toHaveCount(1);

    // Iniciar checkout
    await cartPage.proceedToCheckout();
    await page.waitForURL(/.*checkout-step-one\.html/);

    // Preencher informações do checkout
    await checkoutStepOne.fillCheckoutInfo('João', 'Silva', '12345-678');
    
    // Verificar que os campos foram preenchidos
    await expect(checkoutStepOne.firstNameInput).toHaveValue('João');
    await expect(checkoutStepOne.lastNameInput).toHaveValue('Silva');
    await expect(checkoutStepOne.postalCodeInput).toHaveValue('12345-678');

    // Continuar para revisão
    await checkoutStepOne.continue();
    await page.waitForURL(/.*checkout-step-two\.html/);

    // Verificar que está na página de revisão
    await expect(checkoutStepTwo.summaryInfo).toBeVisible();

    // Finalizar pedido
    await checkoutStepTwo.finish();
    await page.waitForURL(/.*checkout-complete\.html/);

    // Verificar página de confirmação
    const isSuccess = await checkoutComplete.verifySuccess();
    expect(isSuccess).toBe(true);
    
    await expect(checkoutComplete.completeHeader).toBeVisible();
    await expect(checkoutComplete.completeText).toBeVisible();
  });

  test('deve validar campos obrigatórios no checkout', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);

    // Navegar para o carrinho e iniciar checkout
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();
    await page.waitForURL(/.*checkout-step-one\.html/);

    // Tentar continuar sem preencher os campos
    await checkoutStepOne.continueButton.click();

    // Verificar que ainda está na mesma página (validação impediu avanço)
    // ou verificar mensagem de erro se existir
    const currentUrl = page.url();
    expect(currentUrl).toContain('checkout-step-one');
  });

  test('deve permitir cancelar checkout e voltar ao carrinho', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);

    // Navegar para o carrinho e iniciar checkout
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();
    await page.waitForURL(/.*checkout-step-one\.html/);

    // Cancelar checkout
    await checkoutStepOne.cancelButton.click();
    await page.waitForURL(/.*cart\.html/);

    // Verificar que voltou para o carrinho
    await expect(cartPage.cartList).toBeVisible();
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test('deve completar checkout com diferentes informações', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    // Navegar para o carrinho e iniciar checkout
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();

    // Preencher com informações diferentes
    await checkoutStepOne.fillCheckoutInfo('Maria', 'Santos', '98765-432');
    await checkoutStepOne.continue();
    await page.waitForURL(/.*checkout-step-two\.html/);

    // Finalizar
    await checkoutStepTwo.finish();
    await page.waitForURL(/.*checkout-complete\.html/);

    // Verificar sucesso
    const isSuccess = await checkoutComplete.verifySuccess();
    expect(isSuccess).toBe(true);
  });
});

