import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    rules: {
      // General JS/TS style
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'object-curly-spacing': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],

      // Vue-specific style
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': ['error', { singleline: 3 }],
      'vue/multiline-html-element-content-newline': ['error'],
      'vue/singleline-html-element-content-newline': ['error'],
      'vue/html-self-closing': ['error', {
        html: { void: 'always', normal: 'never', component: 'always' },
      }],
    },
  },
);
