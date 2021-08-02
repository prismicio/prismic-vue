import type { App } from "vue";
import type { PrismicPluginOptions } from "../types";

export interface SDKWithInterface<
	Interface extends Record<string, unknown> | unknown = Record<string, never>,
> {
	options: Required<PrismicPluginOptions>;
	interface: Interface;
	install: (app: App) => void;
}

export type SDKWithInterfaceKeys = keyof SDKWithInterface;

export abstract class SDK implements SDKWithInterface<unknown> {
	constructor(public options: Required<PrismicPluginOptions>) {}

	abstract get interface(): unknown;

	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	install(app: App): void {}
}
