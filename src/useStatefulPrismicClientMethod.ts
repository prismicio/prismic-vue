import { isRef, ref, Ref, shallowRef, unref, watch } from "vue";

import {
	Client,
	ForbiddenError,
	ParsingError,
	PrismicError,
} from "@prismicio/client";

import { usePrismic } from "./usePrismic";
import { PrismicClientComposableState, VueUseParameters } from "./types";

// Helpers
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClientMethodLike = (...args: any[]) => Promise<any> | any;

type ClientMethods = typeof Client.prototype;

type ClientError = PrismicError | ParsingError | ForbiddenError;

// Interfaces
export type ClientMethodParameters<TMethodName extends keyof ClientMethods> =
	ClientMethods[TMethodName] extends ClientMethodLike
		? VueUseParameters<Parameters<ClientMethods[TMethodName]>>
		: never;

export type ClientMethodReturnType<TMethodName extends keyof ClientMethods> =
	ClientMethods[TMethodName] extends ClientMethodLike
		? ReturnType<ClientMethods[TMethodName]>
		: never;

export type ComposableOnlyParameters = {
	client?: Ref<Client> | Client;
};

export type ClientComposableReturnType<TClientMethodReturnType = unknown> = {
	state: Ref<PrismicClientComposableState>;
	data: Ref<TClientMethodReturnType | null>;
	error: Ref<ClientError | null>;
	refresh: () => Promise<void>;
};

/**
 * Determines if a value is a `@prismicio/client` params object.
 *
 * @param value - The value to check.
 *
 * @returns `true` if `value` is a `@prismicio/client` params object, `false` otherwise.
 */
const isParams = (
	value: unknown,
): value is ClientMethodParameters<"get">[0] & ComposableOnlyParameters => {
	// This is a *very* naive check.
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

// Implementation
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
	const error = ref<ClientError | null>(null);
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
		} catch (error) {
			state.value = PrismicClientComposableState.Error;
			error.value = error;
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
