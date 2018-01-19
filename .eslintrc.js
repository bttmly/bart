module.exports = {
  parserOptions: {
    ecmaVersion: 8,
  },
  env: {
    node: true,
    mocha: true,
    es6: true,
  },
  rules: {
    quotes: [ 2 ],
    "no-redeclare": 2,
    "no-shadow": 2,
    "no-else-return": 2,
    "default-case": 2,
    "comma-dangle": [2, "always-multiline"],
    "no-dupe-keys": 2,
    "no-duplicate-case": 2,
    "no-func-assign": 2,
    "no-undef": 2,
    "no-unused-vars": 2,
  },
}
