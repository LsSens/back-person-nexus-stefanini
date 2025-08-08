module.exports = {
  apps: [{
    name: 'pessoa-cadastro-api',
    script: 'dist/src/main.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_NAME: 'h2db.db',
      JWT_SECRET: 'seu-jwt-secret-super-seguro',
      JWT_EXPIRES_IN: '1d'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
