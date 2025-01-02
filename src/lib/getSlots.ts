import {
	type ConcreteComponent,
	type Slot,
	type Slots,
	Text,
	type VNode,
	h,
} from "vue"

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
	fallback?: string,
): VNode[] | Slots | Slot | undefined => {
	const fallbackSlot = fallback ? () => [h(Text, fallback)] : undefined
	if (typeof parent === "string") {
		return slots.default ? slots.default(defaultPayload) : fallbackSlot?.()
	} else {
		if (slots.default) {
			const content = slots.default(defaultPayload)

			return {
				...slots,
				default: content.length ? () => content : fallbackSlot,
			}
		} else {
			return fallbackSlot
		}
	}
}
