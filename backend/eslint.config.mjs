// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // Không báo lỗi khi khai báo biến mà chưa dùng
      'prettier/prettier': 'off', // Tắt hoàn toàn các lỗi về dấu cách, xuống dòng của Prettier
      '@typescript-eslint/no-empty-function': 'off',
      'prefer-const': 'off', // Cho phép dùng 'let' thay vì bắt buộc dùng 'const'
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off', // Tắt lỗi truy cập .code từ any
      '@typescript-eslint/no-unsafe-assignment': 'off', // Tắt lỗi gán giá trị any cho biến
      '@typescript-eslint/no-unsafe-argument': 'off', // Tắt lỗi truyền any vào hàm/phương thức
      '@typescript-eslint/no-unsafe-call': 'off', // Tắt lỗi gọi hàm từ biến any
      '@typescript-eslint/no-unsafe-return': 'off', // Tắt lỗi trả về giá trị any
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
);
