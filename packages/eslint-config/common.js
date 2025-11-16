import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
}, {
  files: ['**/*.{js,ts,vue}'],
  rules: {
    'ts/consistent-type-definitions': 'off',
  },
})
