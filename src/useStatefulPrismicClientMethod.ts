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
export type ClientMethodParameters<TMethodName extends keyof ClientMethods> =
	ClientMethods[TMethodName] extends ClientMethodLike
		? Parameters<ClientMethods[TMethodName]>
		: never;

export type ClientComposableReturnType<TClientMethodReturnType = unknown> = {
	state: Ref<PrismicClientComposableState>;
	data: Ref<TClientMethodReturnType | null>;
	error: Ref<ClientError | null>;
	refresh: () => Promise<void>;
};

// Implementation
export const useStatefulPrismicClientMethod = <
	TClientMethod extends ClientMethodLike,
	TClientMethodArguments extends Parameters<TClientMethod>,
	TClientMethodReturnType extends UnwrapPromise<ReturnType<TClientMethod>>,
>(
	method: TClientMethod,
	args: TClientMethodArguments,
): ClientComposableReturnType<TClientMethodReturnType> => {
	const { client } = usePrismic();

	const state = ref<PrismicClientComposableState>(
		PrismicClientComposableState.Idle,
	);
	const data = shallowRef<TClientMethodReturnType | null>(null);
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
