'use strict';

module.exports = {
  apps: [
    {
      name: 'ikea_clone',
      script: './build/index.js',
      watch: true,
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
      env_test: { NODE_ENV: 'test' },
    },
  ],
};
