/** @type {import('stylelint').Config} */

export default {
  extends: ['stylelint-prettier/recommended', 'stylelint-config-standard'],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    'color-hex-length': 'long',
    // 禁用未知规则警告
    'block-no-redundant-nested-style-rules': null,
    'media-type-no-deprecated': null,
    'nesting-selector-no-missing-scoping-root': null,
    'no-invalid-position-declaration': null,
    'property-no-deprecated': null,
  },
};
