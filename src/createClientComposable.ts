import { isRef, Ref, ref, unref, watch } from "vue";

import { Query } from "@prismicio/client";
import { PrismicDocument } from "@prismicio/types";

import { usePrismic } from "./prismic";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export const createClientComposable = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TMethod extends (...args: any[]) => Promise<any>,
	TArgs extends (unknown | Ref<unknown>)[],
	TNormalizer extends
		| typeof normalizeSingleResult
		| typeof normalizePaginatedResult
		| typeof normalizeMultipleResult,
>(
	method: TMethod,
	normalizer: TNormalizer,
) => {
	return <DocumentType extends PrismicDocument = PrismicDocument>(
		...args: { [K in keyof TArgs]: TArgs[K] | Ref<TArgs[K]> }
	): ReturnType<TNormalizer> => {
		const result = ref(null) as Ref<UnwrapPromise<ReturnType<TMethod>> | null>;

		const { client } = usePrismic();

		// TODO: Add query state

		const refresh = async (): Promise<void> => {
			result.value = await method.call(
				client,
				...args.map((arg) => unref(arg)),
			);
		};

		// Watch if any of the arg is reactive
		const argsRef = args.filter((arg) => isRef(arg));
		if (argsRef.length) {
			watch(argsRef, refresh, { deep: true });
		}

		// Fetch once
		refresh();

		// @ts-expect-error normalizer is consistent with TNormalizer
		return normalizer<TMethod, DocumentType>(result, refresh);
	};
};

const normalizeSingleResult = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TMethod extends (...args: any[]) => Promise<any>,
	DocumentType extends PrismicDocument = PrismicDocument,
>(
	result: Ref<UnwrapPromise<ReturnType<TMethod>> | null>,
	refresh: () => Promise<void>,
): {
	document: Ref<DocumentType | null>;
	refresh: () => Promise<void>;
} => {
	return {
		document: result,
		refresh,
	};
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createClientComposableSingle = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TMethod extends (...args: any[]) => Promise<any>,
	TArgs extends (unknown | Ref<unknown>)[],
>(
	method: TMethod,
) => {
	return createClientComposable<TMethod, TArgs, typeof normalizeSingleResult>(
		method,
		normalizeSingleResult,
	);
};

const normalizePaginatedResult = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TMethod extends (...args: any[]) => Promise<any>,
	DocumentType extends PrismicDocument = PrismicDocument,
>(
	result: Ref<UnwrapPromise<ReturnType<TMethod>> | null>,
	refresh: () => Promise<void>,
): {
	query: Ref<Query<DocumentType> | null>;
	refresh: () => Promise<void>;
} => {
	return {
		query: result,
		refresh,
	};
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createClientComposablePaginated = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TMethod extends (...args: any[]) => Promise<any>,
	TArgs extends (unknown | Ref<unknown>)[],
>(
	method: TMethod,
) => {
	return createClientComposable<
		TMethod,
		TArgs,
		typeof normalizePaginatedResult
	>(method, normalizePaginatedResult);
};

const normalizeMultipleResult = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TMethod extends (...args: any[]) => Promise<any>,
	DocumentType extends PrismicDocument = PrismicDocument,
>(
	result: Ref<UnwrapPromise<ReturnType<TMethod>> | null>,
	refresh: () => Promise<void>,
): {
	documents: Ref<DocumentType[] | null>;
	refresh: () => Promise<void>;
} => {
	return {
		documents: result as Ref<DocumentType[] | null>,
		refresh,
	};
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createClientComposableMultiple = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TMethod extends (...args: any[]) => Promise<any>,
	TArgs extends (unknown | Ref<unknown>)[],
>(
	method: TMethod,
) => {
	return createClientComposable<TMethod, TArgs, typeof normalizeMultipleResult>(
		method,
		normalizeMultipleResult,
	);
};
