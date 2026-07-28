import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Signup from '../pages/Signup';
import { ToastProvider } from '../context/ToastContext';

const renderSignup = (onLogin = vi.fn()) => {
  return render(
    <ToastProvider>
      <BrowserRouter>
        <Signup onLogin={onLogin} />
      </BrowserRouter>
    </ToastProvider>
  );
};

describe('Signup Component', () => {
  it('renders registration headline and input fields', () => {
    renderSignup();
    expect(screen.getByText(/Start Practicing Real AI Interviews Today/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });

  it('fails submission if password confirmation does not match', () => {
    const handleLogin = vi.fn();
    renderSignup(handleLogin);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Alex' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'alex@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'different' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account & Begin Practice/i }));

    expect(handleLogin).not.toHaveBeenCalled();
  });
});
