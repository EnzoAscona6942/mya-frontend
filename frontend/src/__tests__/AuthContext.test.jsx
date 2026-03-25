import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn((token) => {
    if (token === 'expired_token') {
      throw new Error('Token expired');
    }
    return { id: 1, email: 'test@test.com', exp: Math.floor(Date.now() / 1000) + 3600 };
  }),
}));

// Mock api
vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { api } from '../lib/api';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should update user state when login is successful', async () => {
      const mockResponse = {
        token: 'valid_jwt_token',
        user: { id: 1, email: 'test@test.com' }
      };
      
      api.post.mockResolvedValueOnce(mockResponse);

      let contextValue;
      function TestComponent() {
        const auth = useAuth();
        contextValue = auth;
        return null;
      }

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initial load
      await waitFor(() => expect(contextValue.loading).toBe(false));

      // Perform login
      const result = await contextValue.login('test@test.com', 'password123');

      expect(result.success).toBe(true);
      expect(api.post).toHaveBeenCalledWith('/auth/login', { 
        email: 'test@test.com', 
        password: 'password123' 
      });
    });

    it('should return error when login fails', async () => {
      api.post.mockRejectedValueOnce({ error: 'Invalid credentials' });

      let contextValue;
      function TestComponent() {
        const auth = useAuth();
        contextValue = auth;
        return null;
      }

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => expect(contextValue.loading).toBe(false));

      const result = await contextValue.login('wrong@test.com', 'wrongpass');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should clear user state when logout is called', async () => {
      // First, simulate that we have a token in localStorage
      // This will trigger the initial load effect
      const mockDecodedUser = { id: 1, email: 'test@test.com', exp: Math.floor(Date.now() / 1000) + 3600 };
      
      // Setup initial load mocks - jwt-decode will be called on init
      api.get.mockResolvedValueOnce({ caja: null });

      let contextValue;
      function TestComponent() {
        const auth = useAuth();
        contextValue = auth;
        return null;
      }

      // Set token before rendering so the effect runs
      localStorage.setItem('token', 'valid_jwt_token');
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initial load to complete
      await waitFor(() => expect(contextValue.loading).toBe(false));
      
      // Verify user is loaded from token
      expect(contextValue.usuario).not.toBeNull();
      expect(contextValue.token).toBe('valid_jwt_token');

      // Perform logout
      contextValue.logout();

      // Verify cleared state immediately after logout
      await waitFor(() => {
        expect(contextValue.usuario).toBeNull();
        expect(contextValue.token).toBeNull();
        expect(contextValue.cajaActiva).toBeNull();
      });
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('loading state', () => {
    it('should provide loading state during authentication check', async () => {
      let contextValue;
      function TestComponent() {
        const auth = useAuth();
        contextValue = auth;
        return null;
      }

      const { rerender } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initially loading should be false after initial render completes
      await waitFor(() => expect(contextValue.loading).toBe(false));
    });
  });
});