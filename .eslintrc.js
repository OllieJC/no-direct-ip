module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "no-global-assign": [
      "error", {"exceptions": ["browser", "chrome", "module"]}
    ],
    "no-unused-vars": [
      "off"
    ]
  }
}
