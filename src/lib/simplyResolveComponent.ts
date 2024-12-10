import type { ConcreteComponent, DefineComponent, Raw, VNode } from "vue"
import { resolveDynamicComponent } from "vue"

/**
 * A stricter version of {@link resolveDynamicComponent} that resolves only type
 * {@link VNode} for existing components or provided `string`.
 *
 * @param component - An HTML tag name or a component.
 *
 * @returns Resolved component as a {@link VNode} or provided `string`.
 *
 * @internal
 */
export const simplyResolveComponent = (
	component: string | ConcreteComponent | Raw<DefineComponent>,
): string | VNode => {
	return resolveDynamicComponent(component) as string | VNode
}
