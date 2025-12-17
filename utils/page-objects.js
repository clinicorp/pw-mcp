const { getUrl } = require('./urls');

/**
 * Page Object para a página de Login
 */
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('.error-message-container');
  }

  async goto() {
    await this.page.goto(getUrl('login'));
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

/**
 * Page Object para a página de Lista de Produtos
 */
class ProductsPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async goto() {
    await this.page.goto(getUrl('lista-produtos'));
  }

  async addToCart(productName) {
    // Converte o nome do produto para o formato do data-test attribute
    const testId = productName.toLowerCase().replace(/\s+/g, '-');
    const addButton = this.page.locator(`[data-test="add-to-cart-${testId}"]`);
    await addButton.click();
  }

  async addFirstProductToCart() {
    // Adiciona o primeiro produto disponível
    const firstAddButton = this.page.locator('[data-test^="add-to-cart"]').first();
    await firstAddButton.click();
  }

  async getCartBadgeCount() {
    const badge = this.shoppingCartBadge;
    if (await badge.isVisible()) {
      return parseInt(await badge.textContent());
    }
    return 0;
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }
}

/**
 * Page Object para a página de Detalhes do Produto
 */
class ProductDetailsPage {
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  async goto(productId = 4) {
    await this.page.goto(getUrl('detalhes-produto'));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}

/**
 * Page Object para a página do Carrinho
 */
class CartPage {
  constructor(page) {
    this.page = page;
    this.cartList = page.locator('[data-test="cart-list"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto() {
    await this.page.goto(getUrl('carrinho'));
  }

  async removeItem(productName) {
    // Converte o nome do produto para o formato do data-test attribute
    const testId = productName.toLowerCase().replace(/\s+/g, '-');
    const removeButton = this.page.locator(`[data-test="remove-${testId}"]`);
    await removeButton.click();
  }

  async removeFirstItem() {
    const firstRemoveButton = this.page.locator('[data-test^="remove-"]').first();
    await firstRemoveButton.click();
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

/**
 * Page Object para a página de Checkout Step One (Informações)
 */
class CheckoutStepOnePage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async goto() {
    await this.page.goto(getUrl('checkout-step-one'));
  }

  async fillCheckoutInfo(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }
}

/**
 * Page Object para a página de Checkout Step Two (Revisão)
 */
class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.summaryInfo = page.locator('.summary_info');
  }

  async goto() {
    await this.page.goto(getUrl('checkout-step-two'));
  }

  async finish() {
    await this.finishButton.click();
  }
}

/**
 * Page Object para a página de Checkout Complete
 */
class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async goto() {
    await this.page.goto(getUrl('checkout-complete'));
  }

  async verifySuccess() {
    const header = await this.completeHeader.textContent();
    return header && header.includes('Thank you');
  }
}

module.exports = {
  LoginPage,
  ProductsPage,
  ProductDetailsPage,
  CartPage,
  CheckoutStepOnePage,
  CheckoutStepTwoPage,
  CheckoutCompletePage
};

