<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
	getDefaultProps,
	getDefaultSlices,
	getDefaultMessage,
	onClickHandler,
	disableEventHandler,
	simulatorClass,
	simulatorRootClass,
	StateEventType,
	SimulatorManager,
} from "@prismicio/simulator/kit";

/** Props for `<SliceSimulator />`. */
export type SliceSimulatorProps = {
	/** The z-index value of the simulator so that it's displayed above layout elements. */
	zIndex?: number
	/** The background color of the simulator to match website design. */
	background?: string
}

const props = defineProps<SliceSimulatorProps>()
defineOptions({ name: "SliceSimulator" })

const slices = ref(getDefaultSlices());
const message = ref(getDefaultMessage());

const simulatorManager = new SimulatorManager();

onMounted(() => {
	simulatorManager.state.on(
		StateEventType.Slices,
		(_slices) => { slices.value = _slices; },
		"simulator-slices",
	);
	simulatorManager.state.on(
		StateEventType.Message,
		(_message) => { message.value = _message; },
		"simulator-message",
	);

	simulatorManager.init();
});

onUnmounted(() => {
	simulatorManager.state.off(StateEventType.Slices, "simulator-slices");

	simulatorManager.state.off(StateEventType.Message, "simulator-message");
});
</script>

<template>
	<div
		:class="simulatorClass"
		:style="{
			zIndex: props.zIndex || getDefaultProps().zIndex,
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100vh',
			overflow: 'auto',
			background: props.background || getDefaultProps().background,
		}"
	>
		<article v-if="message" v-html="message" />
		<div
			v-else-if="slices.length"
			id="root"
			:class="simulatorRootClass"
			@click.capture="onClickHandler"
			@submit.capture="disableEventHandler"
		>
			<slot :slices="slices" />
		</div>
	</div>
</template>
