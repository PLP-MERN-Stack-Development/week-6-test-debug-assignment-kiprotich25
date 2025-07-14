import React from 'react'; // ✅ Add this line
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';



// Mock services
jest.mock('@/services/api', () => ({
  authService: {
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  },
}));

// Mock useNavigate from React Router
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const { authService } = require('@/services/api');

describe('Navbar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows login and signup when user is not authenticated', () => {
    authService.getCurrentUser.mockReturnValue(null);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/my blog/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });

  it('shows new post and logout when user is authenticated', () => {
    authService.getCurrentUser.mockReturnValue({ username: 'kipro' });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/new post/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
  });

  it('calls logout and navigates to /login on logout click', () => {
    authService.getCurrentUser.mockReturnValue({ username: 'kipro' });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByText(/logout/i);
    fireEvent.click(logoutBtn);

    expect(authService.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
