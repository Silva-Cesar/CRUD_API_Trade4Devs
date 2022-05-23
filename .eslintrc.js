module.exports = {
   env: {
     browser: true,
     es2021: true,
   },
   root: true,
   extends: [
    'plugin:@typescript-eslint/eslint-recommended', // Usa as regras recomendadas do @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Usa eslint-config-prettier para desabilitar regras ESLint de @typescript-eslint/eslint-plugin que entraria em conflito com Prettier
    'plugin:prettier/recommended', // Ativa o eslint-plugin-prettier e exibe erros Prettier como erros ESLint. Certifique-se de que esta seja sempre a última configuração no array
   ],
   parser: '@typescript-eslint/parser',
   parserOptions: {
     ecmaVersion: 12,
     sourceType: 'module',
   },
   plugins: ['@typescript-eslint'],
   rules: {
     'linebreak-style': 0,
     'no-console': 'off',
     'class-methods-use-this': 'off',
     'max-len': 'off',
     'no-unused-vars': 'off',
     'no-shadow': 'off',
     'consistent-return': 'off',
     'lines-between-class-members': 'off',
     'no-use-before-define': 'off',
     'no-param-reassign': 'off',
     'no-undef': 'off',
     '@typescript-eslint/no-explicit-any': 'off',
     '@typescript-eslint/explicit-module-boundary-types': 'off',
     '@typescript-eslint/no-empty-function': 'off',
     '@typescript-eslint/no-unused-vars': 'off',
     'import/extensions': [
       'error',
       'ignorePackages',
       {
         js: 'never',
         jsx: 'never',
         ts: 'never',
         tsx: 'never',
       },
     ],
   },
   settings: {
     'import/resolver': {
       typescript: {},
     },
   },
 };