import type { ConcreteComponent, DefineComponent, Raw } from "vue"

export type ComponentOrTagName =
	| string
	| ConcreteComponent
	| Raw<DefineComponent>
