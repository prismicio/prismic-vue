import {
	Client,
	ForbiddenError,
	ParsingError,
	PrismicError,
} from "@prismicio/client";
import { Ref, isRef, ref, shallowRef, unref, watch } from "vue";

import { PrismicClientComposableState, VueUseParameters } from "./types";

import { usePrismic } from "./usePrismic";

// Helpers
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClientMethodLike = (...args: any[]) => Promise<any> | any;
type ClientMethods = typeof Client.prototype;
type ClientError = PrismicError<unknown> | ParsingError | ForbiddenError;

// Interfaces

/**
 * @internal
 */
export type ClientMethodParameters<TMethodName extends keyof ClientMethods> =
	ClientMethods[TMethodName] extends ClientMethodLike
		? VueUseParameters<Parameters<ClientMethods[TMethodName]>>
		: never;

/**
 * @internal
 */
export type ClientMethodReturnType<TMethodName extends keyof ClientMethods> =
	ClientMethods[TMethodName] extends ClientMethodLike
		? ReturnType<ClientMethods[TMethodName]>
		: never;

/**
 * @internal
 */
export type ComposableOnlyParameters = {
	client?: Ref<Client> | Client;
};

/**
 * The return type of a `@prismicio/client` Vue composable.
 *
 * @typeParam TData - The expected format of the `data` property of the returned
 *   object
 */
export type ClientComposableReturnType<TData = unknown> = {
	/**
	 * The current state of the composable's client method call.
	 */
	state: Ref<PrismicClientComposableState>;

	/**
	 * Data returned by the client.
	 */
	data: Ref<TData | null>;

	/**
	 * Error returned by the composable's client method call if in an errror
	 * state.
	 */
	error: Ref<ClientError | Error | null>;

	/**
	 * Perform the composable's client method call again.
	 */
	refresh: () => Promise<void>;
};

/**
 * Determines if a value is a `@prismicio/client` params object.
 *
 * @param value - The value to check
 *
 * @returns `true` if `value` is a `@prismicio/client` params object, `false`
 *   otherwise
 */
const isParams = (
	value: unknown,
): value is ClientMethodParameters<"get">[0] & ComposableOnlyParameters => {
	// This is a *very* naive check.
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

/**
 * A low level Vue composable that uses provided method name on plugin or
 * provided client with given arguments. The composable has its own internal
 * state manager to report async status, such as pending or error statuses.
 *
 * @typeParam TClientMethodName - A method name from `@prismicio/client`
 * @typeParam TClientMethodArguments - The method expected arguments
 * @typeParam TClientMethodReturnType - The method expected return type
 *
 * @param method - The `@prismicio/client` method name to use
 * @param args - The arguments to use with requested method
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @internal
 */
export const useStatefulPrismicClientMethod = <
	TClientMethodName extends keyof ClientMethods,
	TClientMethodArguments extends ClientMethodParameters<TClientMethodName>,
	TClientMethodReturnType extends UnwrapPromise<
		ClientMethodReturnType<TClientMethodName>
	>,
>(
	methodName: TClientMethodName,
	args: TClientMethodArguments,
): ClientComposableReturnType<TClientMethodReturnType> => {
	const { client } = usePrismic();

	const state = ref<PrismicClientComposableState>(
		PrismicClientComposableState.Idle,
	);
	const data = shallowRef<TClientMethodReturnType | null>(null);
	const error = ref<ClientError | Error | null>(null);
	const refresh = async (): Promise<void> => {
		const lastArg = unref(args[args.length - 1]);
		const { client: explicitClient, ...params } = isParams(lastArg)
			? (lastArg as ClientMethodParameters<"get">[0] & ComposableOnlyParameters)
			: ({} as ComposableOnlyParameters);
		const argsWithoutParams = isParams(lastArg) ? args.slice(0, -1) : args;

		state.value = PrismicClientComposableState.Pending;
		data.value = null;
		error.value = null;
		try {
			data.value = await (
				(unref(explicitClient) || client)[methodName] as ClientMethodLike
			)(
				...argsWithoutParams.map((arg: Ref<unknown> | unknown) => unref(arg)),
				params,
			);
			state.value = PrismicClientComposableState.Success;
		} catch (err) {
			state.value = PrismicClientComposableState.Error;
			error.value = err as ClientError | Error;
		}
	};

	// Watch reactive args
	const refArgs = args.filter((arg) => isRef(arg));
	if (refArgs.length) {
		watch(refArgs, refresh, { deep: true });
	}

	// Fetch once
	refresh();

	return { state, data, error, refresh };
};
