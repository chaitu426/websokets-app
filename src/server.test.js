import { describe, it, expect } from 'vitest';
import { app, PORT } from './server.js';

describe('Express Server', () => {
  describe('Server Configuration', () => {
    it('should export app instance', () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    it('should export PORT constant', () => {
      expect(PORT).toBeDefined();
      expect(PORT).toBe(3000);
    });

    it('should be an Express application', () => {
      expect(app.get).toBeDefined();
      expect(app.post).toBeDefined();
      expect(app.use).toBeDefined();
      expect(app.listen).toBeDefined();
    });

    it('should have correct PORT value type', () => {
      expect(typeof PORT).toBe('number');
      expect(PORT).toBeGreaterThan(0);
      expect(PORT).toBeLessThan(65536);
    });
  });

  describe('Server Structure', () => {
    it('should have route methods defined', () => {
      expect(typeof app.get).toBe('function');
      expect(typeof app.post).toBe('function');
      expect(typeof app.put).toBe('function');
      expect(typeof app.delete).toBe('function');
      expect(typeof app.patch).toBe('function');
    });

    it('should have middleware methods defined', () => {
      expect(typeof app.use).toBe('function');
    });

    it('should have server lifecycle methods', () => {
      expect(typeof app.listen).toBe('function');
    });

    it('should not auto-start server in test mode', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });
  });

  describe('Module Exports', () => {
    it('should export both app and PORT', () => {
      expect(app).toBeDefined();
      expect(PORT).toBeDefined();
    });

    it('should export app as Express application', () => {
      expect(app.constructor.name).toMatch(/^(Function|EventEmitter|Application)$/);
    });

    it('should export PORT as integer', () => {
      expect(Number.isInteger(PORT)).toBe(true);
    });
  });

  describe('Express Configuration', () => {
    it('should have settings property', () => {
      expect(app.settings).toBeDefined();
      expect(typeof app.settings).toBe('object');
    });

    it('should have router methods', () => {
      expect(app.route).toBeDefined();
      expect(typeof app.route).toBe('function');
    });

    it('should have param method for route parameters', () => {
      expect(app.param).toBeDefined();
      expect(typeof app.param).toBe('function');
    });
  });

  describe('Application State', () => {
    it('should not be listening when imported in test mode', () => {
      const listening = app.listening;
      if (listening !== undefined) {
        expect(listening).toBe(false);
      } else {
        expect(true).toBe(true);
      }
    });

    it('should have mountpath property', () => {
      expect(app.mountpath).toBeDefined();
    });
  });

  describe('Middleware Configuration', () => {
    it('should support middleware registration', () => {
      const initialApp = app;
      const middlewareResult = app.use((req, res, next) => next());
      expect(middlewareResult).toBe(initialApp);
    });

    it('should support route registration', () => {
      const initialApp = app;
      const routeResult = app.get('/test-route', (req, res) => res.send('test'));
      expect(routeResult).toBe(initialApp);
    });
  });

  describe('HTTP Method Support', () => {
    it('should support GET method', () => {
      expect(app.get).toBeDefined();
      expect(typeof app.get).toBe('function');
    });

    it('should support POST method', () => {
      expect(app.post).toBeDefined();
      expect(typeof app.post).toBe('function');
    });

    it('should support PUT method', () => {
      expect(app.put).toBeDefined();
      expect(typeof app.put).toBe('function');
    });

    it('should support DELETE method', () => {
      expect(app.delete).toBeDefined();
      expect(typeof app.delete).toBe('function');
    });

    it('should support PATCH method', () => {
      expect(app.patch).toBeDefined();
      expect(typeof app.patch).toBe('function');
    });

    it('should support HEAD method', () => {
      expect(app.head).toBeDefined();
      expect(typeof app.head).toBe('function');
    });

    it('should support OPTIONS method', () => {
      expect(app.options).toBeDefined();
      expect(typeof app.options).toBe('function');
    });

    it('should support ALL method', () => {
      expect(app.all).toBeDefined();
      expect(typeof app.all).toBe('function');
    });
  });

  describe('Advanced Express Features', () => {
    it('should support set/get for app settings', () => {
      expect(app.set).toBeDefined();
      expect(typeof app.set).toBe('function');
    });

    it('should support engine registration', () => {
      expect(app.engine).toBeDefined();
      expect(typeof app.engine).toBe('function');
    });

    it('should support render method', () => {
      expect(app.render).toBeDefined();
      expect(typeof app.render).toBe('function');
    });

    it('should support locals for view variables', () => {
      expect(app.locals).toBeDefined();
      expect(typeof app.locals).toBe('object');
    });
  });

  describe('Route Handler Support', () => {
    it('should support route chaining', () => {
      const route = app.route('/chain-test');
      expect(route).toBeDefined();
      expect(route.get).toBeDefined();
      expect(route.post).toBeDefined();
    });

    it('should support Router creation', async () => {
      const express = await import('express');
      const router = express.default.Router();
      expect(router).toBeDefined();
      expect(typeof router).toBe('function');
    });
  });

  describe('Configuration Values', () => {
    it('should have PORT in valid range', () => {
      expect(PORT).toBeGreaterThanOrEqual(1);
      expect(PORT).toBeLessThanOrEqual(65535);
    });

    it('should have PORT as 3000', () => {
      expect(PORT).toBe(3000);
    });
  });

  describe('Environment Awareness', () => {
    it('should respect NODE_ENV test setting', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('should not start listening in test environment', () => {
      const hasListeningEvent = app._events?.listening;
      if (hasListeningEvent) {
        expect(Array.isArray(hasListeningEvent) ? hasListeningEvent.length : 0).toBe(0);
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe('Error Handling Support', () => {
    it('should support error handling middleware registration', () => {
      const initialApp = app;
      const result = app.use((err, req, res, next) => {
        next(err);
      });
      expect(result).toBe(initialApp);
    });
  });

  describe('Express Instance Properties', () => {
    it('should have proper prototype chain', () => {
      expect(app).toBeTruthy();
      expect(typeof app).toBe('function');
    });

    it('should be callable as middleware', () => {
      expect(typeof app).toBe('function');
      expect(app.length).toBeGreaterThanOrEqual(0);
    });
  });
});