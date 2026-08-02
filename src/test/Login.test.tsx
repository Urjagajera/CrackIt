import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Login from '../pages/Login';
import { ToastProvider } from '../context/ToastContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue(undefined),
    resetPassword: vi.fn().mockResolvedValue(undefined),
  }),
  AuthProvider: ({ children }: any) => <>{children}</>,
}));
import { AuthProvider } from '../context/AuthContext';

const renderLogin = (onLogin = vi.fn()) => {
  return render(
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Login onLogin={onLogin} />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

describe('Login Component', () => {
  it('renders login form with title and fields', () => {
    renderLogin();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('trims whitespace and rejects blank input submission', () => {
    const handleLogin = vi.fn();
    renderLogin(handleLogin);

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: '   ' } });
    fireEvent.change(passwordInput, { target: { value: '   ' } });
    fireEvent.click(submitBtn);

    expect(handleLogin).not.toHaveBeenCalled();
  });

  it('submits successfully with valid credentials', async () => {
    const handleLogin = vi.fn();
    renderLogin(handleLogin);

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: 'mentor@crackit.ai' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await vi.waitFor(() => {
      expect(handleLogin).toHaveBeenCalledTimes(1);
    });
  });
});
