module.exports = {
  apps: [
    {
      name: 'melody',
      script: '../../server/dist/server/index.js',
      cwd: './scripts/devOps',
      env: {
        NODE_ENV: 'production',
      },
      node_args: '-r dotenv/config',
      instances: 2,
      exec_mode: 'cluster',
      out_file: '../../logs/app.log',
      error_file: '../../logs/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
