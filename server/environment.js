const path = require('path');

// Variables already set in the environment take precedence over server/.env.
try {
    process.loadEnvFile(path.join(__dirname, '.env'));
} catch (error) {
    if (error.code !== 'ENOENT') {
        throw error;
    }
}

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set. Copy server/.env.example to server/.env and set JWT_SECRET, or set it in the environment.');
}

module.exports = { JWT_SECRET };
