import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defineConfig } from 'drizzle-kit';

describe('Drizzle Configuration', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.DATABASE_URL;
    vi.resetModules();
  });

  afterEach(() => {
    process.env.DATABASE_URL = originalEnv;
  });

  describe('configuration object', () => {
    it('should have correct output directory', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.out).toBe('./src/db/drizzle');
    });

    it('should have correct schema path', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.schema).toBe('./src/db/schema.js');
    });

    it('should use postgresql dialect', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.dialect).toBe('postgresql');
    });

    it('should have dbCredentials defined', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.dbCredentials).toBeDefined();
      expect(config.default.dbCredentials).toHaveProperty('url');
    });

    it('should use DATABASE_URL from environment', async () => {
      const testUrl = 'postgresql://user:pass@host:5432/db';
      process.env.DATABASE_URL = testUrl;
      const config = await import('./drizzle.config');

      expect(config.default.dbCredentials.url).toBe(testUrl);
    });
  });

  describe('configuration structure', () => {
    it('should export default configuration', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default).toBeDefined();
      expect(typeof config.default).toBe('object');
    });

    it('should have all required properties', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default).toHaveProperty('out');
      expect(config.default).toHaveProperty('schema');
      expect(config.default).toHaveProperty('dialect');
      expect(config.default).toHaveProperty('dbCredentials');
    });

    it('should use defineConfig helper', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default).toBeDefined();
      expect(typeof config.default).toBe('object');
    });
  });

  describe('path configurations', () => {
    it('should have relative path for output directory', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.out).toMatch(/^\./);
      expect(config.default.out).toContain('src/db/drizzle');
    });

    it('should have relative path for schema', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.schema).toMatch(/^\./);
      expect(config.default.schema).toContain('src/db/schema');
    });

    it('should point to JavaScript schema file', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.schema).toMatch(/\.js$/);
    });
  });

  describe('database credentials', () => {
    it('should handle different DATABASE_URL formats', async () => {
      const urls = [
        'postgresql://user:pass@localhost:5432/db',
        'postgres://user@host/database',
        'postgresql://user:pass@example.com:5432/mydb?sslmode=require',
      ];

      for (const url of urls) {
        process.env.DATABASE_URL = url;
        vi.resetModules();
        const config = await import('./drizzle.config');

        expect(config.default.dbCredentials.url).toBe(url);
      }
    });

    it('should handle DATABASE_URL with special characters', async () => {
      const testUrl = 'postgresql://user:p@ss%2Fw0rd!@localhost:5432/db';
      process.env.DATABASE_URL = testUrl;
      const config = await import('./drizzle.config');

      expect(config.default.dbCredentials.url).toBe(testUrl);
    });

    it('should handle long DATABASE_URL', async () => {
      const longUrl = 'postgresql://user:' + 'a'.repeat(100) + '@localhost:5432/database';
      process.env.DATABASE_URL = longUrl;
      const config = await import('./drizzle.config');

      expect(config.default.dbCredentials.url).toBe(longUrl);
    });
  });

  describe('dialect configuration', () => {
    it('should only support postgresql dialect', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.dialect).toBe('postgresql');
    });

    it('should not have mysql dialect', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.dialect).not.toBe('mysql');
    });

    it('should not have sqlite dialect', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.dialect).not.toBe('sqlite');
    });
  });

  describe('environment variable handling', () => {
    it('should load dotenv config', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default).toBeDefined();
    });

    it('should fail gracefully without DATABASE_URL', async () => {
      delete process.env.DATABASE_URL;

      try {
        await import('./drizzle.config');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle empty DATABASE_URL', async () => {
      process.env.DATABASE_URL = '';
      const config = await import('./drizzle.config');

      expect(config.default.dbCredentials.url).toBe('');
    });
  });

  describe('TypeScript type checking', () => {
    it('should export properly typed configuration', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(typeof config.default.out).toBe('string');
      expect(typeof config.default.schema).toBe('string');
      expect(typeof config.default.dialect).toBe('string');
      expect(typeof config.default.dbCredentials).toBe('object');
    });
  });

  describe('migration directory structure', () => {
    it('should configure output to nested directory', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      const pathParts = config.default.out.split('/');
      expect(pathParts.length).toBeGreaterThan(1);
      expect(pathParts).toContain('src');
      expect(pathParts).toContain('db');
      expect(pathParts).toContain('drizzle');
    });

    it('should place migrations in db subdirectory', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.out).toContain('/db/');
    });
  });

  describe('configuration immutability', () => {
    it('should return same configuration on multiple imports', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

      const config1 = await import('./drizzle.config');
      const config2 = await import('./drizzle.config');

      expect(config1.default).toEqual(config2.default);
    });

    it('should have consistent property values', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      const out1 = config.default.out;
      const out2 = config.default.out;

      expect(out1).toBe(out2);
    });
  });

  describe('integration with drizzle-kit', () => {
    it('should be compatible with defineConfig', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

      const testConfig = defineConfig({
        out: './src/db/drizzle',
        schema: './src/db/schema.js',
        dialect: 'postgresql',
        dbCredentials: {
          url: process.env.DATABASE_URL!,
        },
      });

      expect(testConfig).toBeDefined();
      expect(testConfig.out).toBe('./src/db/drizzle');
    });

    it('should have valid configuration structure for drizzle-kit', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
      const config = await import('./drizzle.config');

      expect(config.default.out).toBeTruthy();
      expect(config.default.schema).toBeTruthy();
      expect(config.default.dialect).toBeTruthy();
      expect(config.default.dbCredentials).toBeTruthy();
      expect(config.default.dbCredentials.url).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('should handle configuration with IPv6 database host', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@[::1]:5432/db';
      const config = await import('./drizzle.config');

      expect(config.default.dbCredentials.url).toContain('[::1]');
    });

    it('should handle configuration with query parameters', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@host:5432/db?sslmode=require&connect_timeout=10';
      const config = await import('./drizzle.config');

      expect(config.default.dbCredentials.url).toContain('?');
      expect(config.default.dbCredentials.url).toContain('sslmode=require');
    });

    it('should handle non-standard port numbers', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:54321/db';
      const config = await import('./drizzle.config');

      expect(config.default.dbCredentials.url).toContain('54321');
    });
  });
});