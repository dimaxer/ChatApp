module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['./test-env.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
