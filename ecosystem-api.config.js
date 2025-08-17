module.exports = {
  apps: [
    {
      // API Backend (NestJS)
      name: 'reclamagolpe-api',
      script: 'dist/src/main.js',
      cwd: './apps/api',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3333
      },
      
      // Memory management
      max_memory_restart: '1G',
      
      // Logging
      error_file: '/var/log/reclamagolpe/api-error.log',
      out_file: '/var/log/reclamagolpe/api-out.log',
      log_file: '/var/log/reclamagolpe/api-combined.log',
      time: true,
      
      // Restart policies
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 3000,
      
      // Watch (disable in production)
      watch: false,
      ignore_watch: ['node_modules', 'uploads', '.git', 'logs'],
      
      // Node.js arguments
      node_args: '--max-old-space-size=2048',
      
      // Monitoring
      instance_var: 'INSTANCE_ID',
      merge_logs: true
    }
  ]
}