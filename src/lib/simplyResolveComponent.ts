import { ConcreteComponent, resolveDynamicComponent } from "vue";

/**
 * A stricter version of {@link resolveDynamicComponent}
 */
export const simplyResolveComponent = (
	component: string | ConcreteComponent,
): string | ConcreteComponent => {
	return resolveDynamicComponent(component) as string | ConcreteComponent;
};
