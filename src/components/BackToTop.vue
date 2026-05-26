<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const isVisible = ref(false);
let ticking = false;

const updateVisibility = () => {
	isVisible.value = window.scrollY > 360;
	ticking = false;
};

const handleScroll = () => {
	if (ticking) return;
	ticking = true;
	window.requestAnimationFrame(updateVisibility);
};

const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
};

onMounted(() => {
	updateVisibility();
	window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
	window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
	<button
		class="back-to-top"
		:class="{ visible: isVisible }"
		type="button"
		aria-label="回到顶部"
		@click="scrollToTop"
	>
		<ArrowUp :size="20" :stroke-width="2.2" aria-hidden="true" />
	</button>
</template>

<style scoped>
.back-to-top {
	position: fixed;
	right: 28px;
	bottom: 28px;
	z-index: 90;
	width: 44px;
	height: 44px;
	border: 1px solid var(--c-hairline);
	border-radius: 50%;
	background: color-mix(in srgb, var(--c-canvas) 88%, transparent);
	color: var(--c-body-strong);
	box-shadow: 0 10px 28px rgba(20, 20, 19, 0.12);
	backdrop-filter: blur(14px);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	opacity: 0;
	visibility: hidden;
	transform: translateY(12px) scale(0.96);
	transition:
		opacity 0.22s ease,
		visibility 0.22s ease,
		transform 0.22s ease,
		background-color 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease;
}

.back-to-top.visible {
	opacity: 1;
	visibility: visible;
	transform: translateY(0) scale(1);
}

.back-to-top:hover {
	border-color: var(--c-primary);
	background: var(--c-primary);
	color: var(--c-on-primary);
	transform: translateY(-2px) scale(1);
}

.back-to-top:focus-visible {
	outline: 2px solid var(--c-primary);
	outline-offset: 3px;
}

[data-theme="dark"] .back-to-top {
	background: color-mix(in srgb, var(--c-surface-dark-elevated) 88%, transparent);
	box-shadow: 0 10px 28px rgba(0, 0, 0, 0.32);
}

[data-theme="dark"] .back-to-top:hover {
	background: var(--c-primary);
}

@media (max-width: 768px) {
	.back-to-top {
		right: 18px;
		bottom: 18px;
		width: 42px;
		height: 42px;
	}
}

@media (prefers-reduced-motion: reduce) {
	.back-to-top {
		transition: opacity 0.01ms, visibility 0.01ms;
	}
}
</style>
