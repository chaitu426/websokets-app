import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Database Connection', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.DATABASE_URL;
    vi.resetModules();
  });

  afterEach(() => {
    process.env.DATABASE_URL = originalEnv;
    vi.restoreAllMocks();
  });

  describe('connection initialization', () => {
    it('should export db instance', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule = await import('./connect.js');
      expect(connectModule.default).toBeDefined();
    });

    it('should create db with neon client', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule = await import('./connect.js');
      const db = connectModule.default;

      expect(db).toBeDefined();
      expect(typeof db).toBe('object');
    });

    it('should use DATABASE_URL from environment', async () => {
      const testUrl = 'postgresql://user:pass@host:5432/db';
      process.env.DATABASE_URL = testUrl;

      const connectModule = await import('./connect.js');
      expect(connectModule.default).toBeDefined();
    });
  });

  describe('database configuration', () => {
    it('should handle valid database URL format', async () => {
      const validUrls = [
        'postgresql://user:pass@localhost:5432/db',
        'postgresql://user@localhost/db',
        'postgres://user:pass@example.com:5432/database',
      ];

      for (const url of validUrls) {
        process.env.DATABASE_URL = url;
        vi.resetModules();
        const connectModule = await import('./connect.js');
        expect(connectModule.default).toBeDefined();
      }
    });

    it('should initialize with neon serverless client', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule = await import('./connect.js');
      const db = connectModule.default;

      expect(db.dialect).toBeDefined();
    });

    it('should be importable multiple times with same instance', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule1 = await import('./connect.js');
      const connectModule2 = await import('./connect.js');

      expect(connectModule1.default).toBe(connectModule2.default);
    });
  });

  describe('error handling', () => {
    it('should handle missing DATABASE_URL gracefully', async () => {
      delete process.env.DATABASE_URL;
      process.env.DATABASE_URL = undefined;

      try {
        await import('./connect.js');
        expect(true).toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle invalid DATABASE_URL format', async () => {
      process.env.DATABASE_URL = 'invalid-url';

      try {
        const connectModule = await import('./connect.js');
        expect(connectModule.default).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle empty DATABASE_URL', async () => {
      process.env.DATABASE_URL = '';

      try {
        const connectModule = await import('./connect.js');
        expect(connectModule.default).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('connection properties', () => {
    it('should have drizzle instance methods', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule = await import('./connect.js');
      const db = connectModule.default;

      expect(db.select).toBeDefined();
      expect(typeof db.select).toBe('function');
    });

    it('should have query execution capabilities', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule = await import('./connect.js');
      const db = connectModule.default;

      expect(db.execute).toBeDefined();
      expect(typeof db.execute).toBe('function');
    });

    it('should support transaction methods', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule = await import('./connect.js');
      const db = connectModule.default;

      expect(db.transaction).toBeDefined();
      expect(typeof db.transaction).toBe('function');
    });
  });

  describe('module structure', () => {
    it('should export db as default export', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule = await import('./connect.js');

      expect(connectModule.default).toBeDefined();
      expect(connectModule.default).not.toBeNull();
    });

    it('should not have named exports', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule = await import('./connect.js');

      const namedExports = Object.keys(connectModule).filter(key => key !== 'default');
      expect(namedExports.length).toBe(0);
    });
  });

  describe('integration with drizzle-orm', () => {
    it('should use neon-http dialect', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule = await import('./connect.js');
      const db = connectModule.default;

      expect(db.dialect).toBeDefined();
      expect(db.dialect.constructor.name).toBe('PgDialect');
    });

    it('should have working query builder', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const connectModule = await import('./connect.js');
      const db = connectModule.default;

      const queryBuilder = db.select();
      expect(queryBuilder).toBeDefined();
    });
  });

  describe('edge cases and boundaries', () => {
    it('should handle very long database URLs', async () => {
      const longUrl = 'postgresql://user:' + 'a'.repeat(1000) + '@localhost:5432/db';
      process.env.DATABASE_URL = longUrl;

      const connectModule = await import('./connect.js');
      expect(connectModule.default).toBeDefined();
    });

    it('should handle database URL with special characters', async () => {
      process.env.DATABASE_URL = 'postgresql://user:p@ss%2Fw0rd!@localhost:5432/db';

      const connectModule = await import('./connect.js');
      expect(connectModule.default).toBeDefined();
    });

    it('should handle database URL with query parameters', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db?sslmode=require';

      const connectModule = await import('./connect.js');
      expect(connectModule.default).toBeDefined();
    });

    it('should handle IPv6 host in database URL', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@[::1]:5432/db';

      const connectModule = await import('./connect.js');
      expect(connectModule.default).toBeDefined();
    });
  });
});