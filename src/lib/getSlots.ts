import { ConcreteComponent, Slots, VNode } from "vue";

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
