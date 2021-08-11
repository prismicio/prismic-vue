import jsdom from "jsdom-global";

jsdom();

// Vue expects SVGElement to be available globally
global.SVGElement = window.SVGElement;

// Disable Vue 3 warnings, failed to find a better way to do it
// console.warn = function (...args) {
// 	if (
// 		(typeof args[0] === "string" && !args[0].startsWith("[Vue warn]:")) ||
// 		typeof args[0] !== "string"
// 	) {
// 		return console.warn(...args);
// 	}
// };
