import { renderWithProviders, waitFor } from "@/utils/test-utils";
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from "$/(auth)/login/page";


describe('login page tests', () => {
    const testCases = [
        { description: 'ambos campos vacíos', username: '', password: '', expected: 'disabled' },
        { description: 'solo el username estácompleto', username: 'usuario_valido', password: '', expected: 'disabled' },
        { description: 'solo la contraseña está completa', username: '', password: 'Password123!', expected: 'disabled' },
        { description: 'username inválido y contraseña válida', username: 'us', password: 'Password123!', expected: 'disabled' },
        { description: 'ambos campos válidos', username: 'usuario_valido', password: 'Password123!', expected: 'enabled' },
    ];

    testCases.forEach(({ description, username, password, expected }) => {
        test(`submit button is ${expected} if form is ${description}`, async () => {
            const user = userEvent.setup();
            const loginPage = renderWithProviders(<LoginPage />);
            const loginOptionButton = loginPage.getByTestId('login-option-button');
            await user.click(loginOptionButton);
            const submitButton = loginPage.getByTestId('login-submit-button');
            let usernameInput = loginPage.getByTestId('username-input');
            let passwordInput = loginPage.getByTestId('password-input');
            await waitFor(() => expect(usernameInput).toBeInTheDocument());
            await waitFor(() => expect(passwordInput).toBeInTheDocument());
            await user.type(usernameInput, username);
            await user.type(passwordInput, password);
            if (expected === 'disabled') { expect(submitButton).toBeDisabled(); } else { expect(submitButton).toBeEnabled(); }
        })
    })

    test('render', () => {
        const loginPage = renderWithProviders(<LoginPage />);
        expect(loginPage).toMatchSnapshot();
    })

    test('login and guest options are switchable', async () => {
        const user = userEvent.setup();
        const loginPage = renderWithProviders(<LoginPage />);
        const loginOptionButton = loginPage.getByTestId('login-option-button');
        const guestOptionButton = loginPage.getByTestId('guest-option-button');
        expect(loginOptionButton).toHaveClass('active');
        await user.click(guestOptionButton);
        expect(guestOptionButton).toHaveClass('active');
        expect(loginOptionButton).not.toHaveClass('active');
    })

    test('shows error message when login fails', async () => {

    })

    test('shows loading when form is submitting', async () => {

    })

    test('redirects to dashboard when login succeeds', async () => {

    })

    test('redirects to forgot password page when forgot password link is clicked', async () => {

    })

    test('redirects to register page when register link is clicked', async () => {

    })
})