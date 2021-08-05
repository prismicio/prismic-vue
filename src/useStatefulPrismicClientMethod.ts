import { isRef, ref, Ref, shallowRef, unref, watch } from "vue";

import {
	Client,
	ForbiddenError,
	ParsingError,
	PrismicError,
} from "@prismicio/client";

import { usePrismic } from "./usePrismic";
import { PrismicClientComposableState } from "./types";

// Helpers
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClientMethodLike = (...args: any[]) => Promise<any> | any;

type ClientMethods = typeof Client.prototype;

type ClientError = PrismicError | ParsingError | ForbiddenError;

// Interfaces
export type ClientMethodParameters<MethodName extends keyof ClientMethods> =
	ClientMethods[MethodName] extends ClientMethodLike
		? Parameters<ClientMethods[MethodName]>
		: never;

export type ClientComposableReturnType<ClientMethodReturnType = unknown> = {
	state: Ref<PrismicClientComposableState>;
	data: Ref<ClientMethodReturnType | null>;
	error: Ref<ClientError | null>;
	refresh: () => Promise<void>;
};

// Implementation
export const useStatefulPrismicClientMethod = <
	ClientMethod extends ClientMethodLike,
	ClientMethodArguments extends Parameters<ClientMethod>,
	ClientMethodReturnType extends UnwrapPromise<ReturnType<ClientMethod>>,
>(
	method: ClientMethod,
	args: ClientMethodArguments,
): ClientComposableReturnType<ClientMethodReturnType> => {
	const { client } = usePrismic();

	const state = ref<PrismicClientComposableState>(
		PrismicClientComposableState.Idle,
	);
	const data = shallowRef<ClientMethodReturnType | null>(null);
	const error = ref<ClientError | null>(null);
	const refresh = async (): Promise<void> => {
		state.value = PrismicClientComposableState.Pending;
		data.value = null;
		error.value = null;
		try {
			data.value = await method.call(client, ...args.map((arg) => unref(arg)));
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
