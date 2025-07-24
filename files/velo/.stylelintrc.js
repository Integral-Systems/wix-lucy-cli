module.exports = {
  // ...your other rules
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      customSyntax: "@stylelint/postcss-css-in-js",
    },
  ],
};