import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import InterviewScreen from '../pages/InterviewScreen';
import { ToastProvider } from '../context/ToastContext';

describe('InterviewScreen Component', () => {
  it('renders timer and end interview button', () => {
    render(
      <ToastProvider>
        <BrowserRouter>
          <InterviewScreen />
        </BrowserRouter>
      </ToastProvider>
    );

    expect(screen.getByText('End Interview')).toBeInTheDocument();
    expect(screen.getByText('Interview Conversation')).toBeInTheDocument();
  });
});
