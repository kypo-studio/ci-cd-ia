// public/.eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  rules: {
    'quotes': ['error', 'single', { 
      avoidEscape: true,
      allowTemplateLiterals: true 
    }],
  },
};
