const config = {
  // 🔑 JWT Secret: Fallback is for development only!
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret_for_development_only",

  // 🛡️ BCRYPT Rounds: Parse as integer, default to 10
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,

  // ⏱️ Token Expiry: Default to 1 day
  TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || "1d",
};

module.exports = config;
