module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: [
    "dist",
    "node_modules",
    "projeto-aninhar.tsx",
    "*.config.*",
    ".eslintrc.cjs",
  ],
  overrides: [
    {
      files: ["server/**/*.js", "tests/server*.js", "scripts/*.mjs"],
      env: { node: true },
      parserOptions: { sourceType: "module", ecmaVersion: "latest" },
    },
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
