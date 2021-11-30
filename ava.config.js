export default {
	extensions: ["js"],
	files: ["./test/**/*.test.js"],
	require: ["esm", "./test/__testutils__/setup.js"],
	verbose: true,
	timeout: "60s",
};
