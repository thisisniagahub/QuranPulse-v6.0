module.exports = {
  apps: [{
    name: "tok-imam-bot",
    script: "./scripts/start_tok_imam.ts",
    interpreter: "node",
    interpreter_args: "--import tsx", // Use tsx loader for TypeScript
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
    },
    // Ensure session files persist
    ignore_watch: ["node_modules", ".wwebjs_auth"],
  }]
};
