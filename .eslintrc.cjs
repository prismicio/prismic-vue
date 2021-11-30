module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 2020,
	},
	extends: ["plugin:prettier/recommended", "plugin:vue/recommended"],
	plugins: [],
	rules: {
		"no-console": ["warn", { allow: ["info", "warn", "error"] }],
		"no-debugger": "warn",
		"no-undef": "off",
		curly: "error",
		"prefer-const": "error",
		"padding-line-between-statements": [
			"error",
			{ blankLine: "always", prev: "*", next: "return" },
		],
		"no-unused-vars": [
			"error",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
			},
		],
		"no-var-requires": "off",
	},
};
