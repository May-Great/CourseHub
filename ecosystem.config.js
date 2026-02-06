module.exports = {
  apps: [
    {
      name: 'coursehub',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
