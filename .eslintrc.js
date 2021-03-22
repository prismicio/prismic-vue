module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: "babel-eslint",
  extends: ["plugin:vue/recommended", "plugin:prettier/recommended"],
  plugins: [],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-undef": 0
  }
};
