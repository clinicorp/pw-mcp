const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('POC - Padrão Clinicorp data-testid', () => {
  test.beforeEach(async ({ page }) => {
    // Carregar a página HTML local
    const htmlPath = path.join(__dirname, '..', 'poc-clinicorp.html');
    await page.goto(`file://${htmlPath}`);
  });

  test('deve encontrar e interagir com elementos usando getByTestId()', async ({ page }) => {
    // ✅ Teste 1: Verificar título usando getByTestId
    const title = page.getByTestId('lbl-title-PAC');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Cadastro de Paciente - Módulo PAC');

    // ✅ Teste 2: Preencher input de nome
    const nameInput = page.getByTestId('txt-name-PAC');
    await nameInput.fill('Teste Automatizado');
    await expect(nameInput).toHaveValue('Teste Automatizado');

    // ✅ Teste 3: Preencher input de email
    const emailInput = page.getByTestId('txt-email-PAC');
    await emailInput.fill('teste@clinicorp.com');
    await expect(emailInput).toHaveValue('teste@clinicorp.com');

    // ✅ Teste 4: Selecionar status no select
    const statusSelect = page.getByTestId('sel-status-PAC');
    await statusSelect.selectOption('active');
    await expect(statusSelect).toHaveValue('active');

    // ✅ Teste 5: Marcar checkbox
    const checkbox = page.getByTestId('chk-agree-PAC');
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // ✅ Teste 6: Clicar no botão salvar usando getByTestId
    const saveButton = page.getByTestId('btn-save-PAC');
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toHaveText('Salvar');
    await saveButton.click();

    // ✅ Teste 7: Verificar mensagem de sucesso
    const message = page.getByTestId('div-message-PAC');
    await expect(message).toBeVisible();
    await expect(message).toContainText('sucesso');
  });

  test('deve interagir com elementos em lista usando índices', async ({ page }) => {
    // ✅ Teste 8: Verificar primeiro paciente da lista
    const firstPatientCard = page.getByTestId('crd-patient-PAC-1');
    await expect(firstPatientCard).toBeVisible();

    const firstName = page.getByTestId('lbl-patient-name-PAC-1');
    await expect(firstName).toHaveText('João Silva');

    const firstEmail = page.getByTestId('spn-patient-email-PAC-1');
    await expect(firstEmail).toHaveText('joao.silva@email.com');

    const firstBadge = page.getByTestId('bdg-status-PAC-1');
    await expect(firstBadge).toHaveText('Ativo');

    // ✅ Teste 9: Clicar no botão editar do primeiro paciente
    const editButton1 = page.getByTestId('btn-edit-PAC-1');
    await expect(editButton1).toBeVisible();
    await editButton1.click();

    // ✅ Teste 10: Verificar segundo paciente
    const secondPatientCard = page.getByTestId('crd-patient-PAC-2');
    await expect(secondPatientCard).toBeVisible();

    const secondName = page.getByTestId('lbl-patient-name-PAC-2');
    await expect(secondName).toHaveText('Maria Santos');

    // ✅ Teste 11: Clicar no botão excluir do terceiro paciente
    const deleteButton3 = page.getByTestId('btn-delete-PAC-3');
    await expect(deleteButton3).toBeVisible();
    await deleteButton3.click();
  });

  test('deve validar todos os tipos de elementos com padrão Clinicorp', async ({ page }) => {
    // ✅ Labels
    await expect(page.getByTestId('lbl-name-PAC')).toBeVisible();
    await expect(page.getByTestId('lbl-email-PAC')).toBeVisible();
    await expect(page.getByTestId('lbl-status-PAC')).toBeVisible();

    // ✅ Inputs
    await expect(page.getByTestId('txt-name-PAC')).toBeVisible();
    await expect(page.getByTestId('txt-email-PAC')).toBeVisible();

    // ✅ Select
    await expect(page.getByTestId('sel-status-PAC')).toBeVisible();

    // ✅ Checkbox
    await expect(page.getByTestId('chk-agree-PAC')).toBeVisible();

    // ✅ Buttons
    await expect(page.getByTestId('btn-save-PAC')).toBeVisible();
    await expect(page.getByTestId('btn-cancel-PAC')).toBeVisible();

    // ✅ Div (está no DOM mas oculta inicialmente)
    const messageDiv = page.getByTestId('div-message-PAC');
    await expect(messageDiv).toBeAttached(); // Verifica se existe no DOM

    // ✅ Span (está no DOM mas oculta inicialmente)
    const messageSpan = page.getByTestId('spn-message-PAC');
    await expect(messageSpan).toBeAttached(); // Verifica se existe no DOM

    // ✅ Cards
    await expect(page.getByTestId('crd-patient-PAC-1')).toBeVisible();
    await expect(page.getByTestId('crd-patient-PAC-2')).toBeVisible();
    await expect(page.getByTestId('crd-patient-PAC-3')).toBeVisible();

    // ✅ Badges
    await expect(page.getByTestId('bdg-status-PAC-1')).toBeVisible();
  });

  test('deve validar fluxo completo de cadastro', async ({ page }) => {
    // Preencher formulário completo
    await page.getByTestId('txt-name-PAC').fill('Novo Paciente');
    await page.getByTestId('txt-email-PAC').fill('novo@clinicorp.com');
    await page.getByTestId('sel-status-PAC').selectOption('active');
    await page.getByTestId('chk-agree-PAC').check();

    // Clicar em salvar
    await page.getByTestId('btn-save-PAC').click();

    // Verificar mensagem de sucesso
    const message = page.getByTestId('div-message-PAC');
    await expect(message).toBeVisible();
    await expect(message).toContainText('sucesso');

    // Verificar que o formulário foi limpo
    await expect(page.getByTestId('txt-name-PAC')).toHaveValue('');
    await expect(page.getByTestId('txt-email-PAC')).toHaveValue('');
  });

  test('deve validar botão cancelar', async ({ page }) => {
    // Preencher alguns campos
    await page.getByTestId('txt-name-PAC').fill('Teste');
    await page.getByTestId('txt-email-PAC').fill('teste@test.com');

    // Clicar em cancelar
    await page.getByTestId('btn-cancel-PAC').click();

    // Verificar que os campos foram limpos
    await expect(page.getByTestId('txt-name-PAC')).toHaveValue('');
    await expect(page.getByTestId('txt-email-PAC')).toHaveValue('');
  });
});

