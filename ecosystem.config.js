module.exports = {
  apps: [
    {
      name: "synapsy",
      script: "node_modules/.bin/next",
      args: "start -p 3008",
      cwd: "/var/www/synapsy",
      env: {
        NODE_ENV: "production",
        PORT: 3008,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "/var/www/synapsy/logs/error.log",
      out_file: "/var/www/synapsy/logs/out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
