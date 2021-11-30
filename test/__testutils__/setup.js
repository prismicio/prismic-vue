import jsdom from "jsdom-global";

jsdom();

// Vue expects SVGElement to be available globally
global.SVGElement = window.SVGElement;
