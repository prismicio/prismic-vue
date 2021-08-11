import { ConcreteComponent, resolveDynamicComponent, VNode } from "vue";

/**
 * A stricter version of {@link resolveDynamicComponent}
 */
export const simplyResolveComponent = (
	component: string | ConcreteComponent,
): string | VNode => {
	return resolveDynamicComponent(component) as string | VNode;
};
