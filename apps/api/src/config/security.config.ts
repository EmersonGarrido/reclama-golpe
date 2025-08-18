export const securityConfig = {
  rateLimit: {
    // Global rate limit
    global: {
      ttl: 60000, // 1 minute
      limit: 100, // requests per minute
    },
    // Auth endpoints - more restrictive
    auth: {
      login: {
        ttl: 60000, // 1 minute
        limit: 5, // 5 attempts per minute
      },
      register: {
        ttl: 60000, // 1 minute
        limit: 3, // 3 registrations per minute
      },
    },
    // Create/Update operations
    write: {
      ttl: 60000,
      limit: 30, // 30 write operations per minute
    },
  },
  cors: {
    production: {
      origins: [
        'https://reclamagolpe.com.br',
        'https://www.reclamagolpe.com.br',
      ],
    },
    development: {
      origins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
      ],
    },
    options: {
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
      maxAge: 86400, // 24 hours
    },
  },
};