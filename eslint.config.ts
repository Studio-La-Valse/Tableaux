// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true, // enable Vue rules
  typescript: true, // set to false if no TS

  rules: {

    // my stuff:
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'], // use 'type' instead of 'interface'

    // vvvv some guy on github

    // Enforce <template> at top of file, then script, then style
    'vue/block-order': [
      'error',
      { order: ['template', 'script', 'style'] },
    ],

    // Enforce new line between each attribute
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 1 },
        multiline: { max: 1 },
      },
    ],

    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'beside',
        multiline: 'below',
      },
    ],

    // Enforce new line between each tag
    'vue/padding-line-between-tags': [
      'error',
      [{
        blankLine: 'always',
        prev: '*',
        next: '*',
      }],
    ],

    // Enforce new line after singline elements
    'vue/singleline-html-element-content-newline': [
      'error',
      {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
      },
    ],

    // Enforce use of useTemplateRef
    'vue/prefer-use-template-ref': ['error'],

    // Enforce new line between multi-line properties
    'vue/new-line-between-multi-line-property': ['error', { minLineOfMultilineProperty: 2 }],

    // Enforce defineOptions for component naming
    'vue/prefer-define-options': ['error'],

    // Enforce PascalCase for component names
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],

    // Enforce <script setup lang="ts"> on .vue files
    'vue/block-lang': [
      'error',
      { script: { lang: 'ts' } },
    ],

    // Enforce <script setup> on .vue files
    'vue/component-api-style': [
      'error',
      ['script-setup'],
    ],

    // Enforce typed emits
    'vue/define-emits-declaration': ['error', 'type-based'],

    // Enforce order of define macros
    'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits'] }],

    // Enforce typed props
    'vue/define-props-declaration': ['error', 'type-based'],

    // Make sure <button> has type attribute
    'vue/html-button-has-type': ['error', {
      button: true,
      submit: true,
      reset: true,
    }],

    // Enforce whitespace around comment content
    'vue/html-comment-content-spacing': ['error', 'always'],

    // Enforce all props with default values be optional
    'vue/no-required-prop-with-default': ['error', { autofix: false }],

    // Enforce refs to have defined types
    'vue/require-typed-ref': ['error'],
  },
})
