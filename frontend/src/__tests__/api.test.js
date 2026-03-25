import { describe, it, expect, beforeEach, vi } from 'vitest';

// We need to import the module fresh for each test
// to ensure clean state

describe('api.js', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn();
  });

  describe('getHeaders', () => {
    it('should add Authorization header when token exists in localStorage', async () => {
      localStorage.setItem('token', 'test_jwt_token');
      
      // Re-require the module to get fresh state with mocked localStorage
      vi.resetModules();
      const { api, getHeaders } = await import('../lib/api');
      
      const headers = getHeaders();
      expect(headers.Authorization).toBe('Bearer test_jwt_token');
    });

    it('should not add Authorization header when no token exists', async () => {
      localStorage.clear();
      
      vi.resetModules();
      const { getHeaders } = await import('../lib/api');
      
      const headers = getHeaders();
      expect(headers.Authorization).toBeUndefined();
    });

    it('should always include Content-Type header', async () => {
      localStorage.clear();
      
      vi.resetModules();
      const { getHeaders } = await import('../lib/api');
      
      const headers = getHeaders();
      expect(headers['Content-Type']).toBe('application/json');
    });
  });

  describe('api.get', () => {
    it('should make GET request with correct headers', async () => {
      localStorage.setItem('token', 'test_token');
      
      vi.resetModules();
      const { api } = await import('../lib/api');
      
      const mockResponse = { data: 'test' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await api.get('/test-endpoint');
      
      // Verify fetch was called with the correct URL and method
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/test-endpoint',
        expect.any(Object)
      );
      // Verify the response is correctly parsed
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when response is not ok', async () => {
      localStorage.clear();
      
      vi.resetModules();
      const { api } = await import('../lib/api');
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Not found' })
      });

      await expect(api.get('/nonexistent')).rejects.toEqual({ error: 'Not found' });
    });
  });

  describe('api.post', () => {
    it('should make POST request with body and headers', async () => {
      localStorage.setItem('token', 'test_token');
      
      vi.resetModules();
      const { api } = await import('../lib/api');
      
      const mockResponse = { id: 1, name: 'New Item' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await api.post('/items', { name: 'New Item' });
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/items',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test_token',
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ name: 'New Item' })
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('api.put', () => {
    it('should make PUT request with body and headers', async () => {
      localStorage.setItem('token', 'test_token');
      
      vi.resetModules();
      const { api } = await import('../lib/api');
      
      const mockResponse = { id: 1, name: 'Updated' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await api.put('/items/1', { name: 'Updated' });
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/items/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated' })
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('api.delete', () => {
    it('should make DELETE request with headers', async () => {
      localStorage.setItem('token', 'test_token');
      
      vi.resetModules();
      const { api } = await import('../lib/api');
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });

      await api.delete('/items/1');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/items/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test_token'
          })
        })
      );
    });
  });
});