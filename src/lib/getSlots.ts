import { ConcreteComponent, Slots, VNode } from "vue";

/**
 * Get the appropriate `slots` object/array according to the provided parent,
 * fixing `Non-function value encountered for default slot.` warnings.
 *
 * @param parent - The parent inheriting slots
 * @param slots - The `slots` to transform for parent
 * @param defaultParams - The parameters to provide to the default slot
 *
 * @returns The appropriate slots object/array
 *
 * @internal
 */
export const getSlots = (
	parent: string | ConcreteComponent,
	slots: Slots,
	defaultPayload?: unknown,
): VNode[] | undefined | Slots => {
	if (typeof parent === "string") {
		return slots.default && slots.default(defaultPayload);
	} else {
		if (slots.default) {
			const content = slots.default(defaultPayload);

			return {
				...slots,
				default: () => content,
			};
		} else {
			return slots;
		}
	}
};
