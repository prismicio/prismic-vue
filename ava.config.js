export default {
	extensions: ["ts"],
	files: ["./test/**/*.test.ts"],
	require: ["ts-eager/register", "./test/__testutils__/setup.ts"],
	verbose: true,
	timeout: "60s",
};
