<script setup lang="ts">
import docsearch from '@docsearch/js';
import '@docsearch/css';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const searchContainer = ref<HTMLElement | null>(null);
let searchInstance: ReturnType<typeof docsearch> | undefined;

onMounted(() => {
	if (!searchContainer.value) return;

	searchInstance = docsearch({
		container: searchContainer.value,
		appId: 'PEKHQFSYYO',
		indexName: 'momoc_robot',
		apiKey: 'ffa9cd55f1c2d8f18c5c7742ba487764',
	});
});

onBeforeUnmount(() => {
	searchInstance?.destroy();
});
</script>

<template>
	<div ref="searchContainer" class="docsearch-root" />
</template>

<style scoped>
.docsearch-root {
	display: flex;
	align-items: center;
	min-width: 220px;
}

.docsearch-root :global(.DocSearch-Button) {
	width: 100%;
	height: 36px;
	margin: 0;
	padding: 0 10px 0 12px;
	border: 1px solid var(--c-hairline);
	border-radius: 8px;
	background: var(--c-surface-soft);
	color: var(--c-muted);
	box-shadow: none;
	transition:
		background-color 0.2s,
		border-color 0.2s,
		color 0.2s;
}

.docsearch-root :global(.DocSearch-Button:hover) {
	border-color: var(--c-primary);
	background: var(--c-surface-card);
	color: var(--c-ink);
	box-shadow: none;
}

.docsearch-root :global(.DocSearch-Button-Container) {
	display: flex;
	align-items: center;
	gap: 8px;
}

.docsearch-root :global(.DocSearch-Search-Icon) {
	width: 16px;
	height: 16px;
	color: var(--c-muted);
	stroke-width: 2;
}

.docsearch-root :global(.DocSearch-Button-Placeholder) {
	padding: 0;
	font-size: 0.8125rem;
	font-weight: 500;
	color: var(--c-muted);
}

.docsearch-root :global(.DocSearch-Button-Keys) {
	min-width: auto;
}

.docsearch-root :global(.DocSearch-Button-Key) {
	top: 0;
	width: auto;
	min-width: 20px;
	height: 20px;
	margin-right: 0;
	padding: 0 5px;
	border: 1px solid var(--c-hairline);
	border-radius: 5px;
	background: var(--c-canvas);
	box-shadow: none;
	color: var(--c-muted-soft);
	font-family: var(--font-mono);
	font-size: 0.6875rem;
}

:global(.DocSearch) {
	--docsearch-primary-color: var(--c-primary);
	--docsearch-highlight-color: var(--c-primary);
	--docsearch-text-color: var(--c-ink);
	--docsearch-muted-color: var(--c-muted);
	--docsearch-searchbox-background: var(--c-surface-soft);
	--docsearch-searchbox-focus-background: var(--c-canvas);
	--docsearch-container-background: rgba(20, 20, 19, 0.42);
	--docsearch-modal-background: var(--c-canvas);
	--docsearch-footer-background: var(--c-surface-soft);
	--docsearch-hit-background: var(--c-canvas);
	--docsearch-hit-color: var(--c-body);
	--docsearch-hit-active-color: var(--c-on-primary);
	--docsearch-hit-shadow: 0 1px 3px rgba(20, 20, 19, 0.08);
	--docsearch-key-gradient: transparent;
	--docsearch-key-shadow: none;
	--docsearch-logo-color: var(--c-muted);
}

:global([data-theme="dark"] .DocSearch) {
	--docsearch-container-background: rgba(0, 0, 0, 0.58);
	--docsearch-modal-background: var(--c-surface-dark-elevated);
	--docsearch-footer-background: var(--c-surface-dark-soft);
	--docsearch-hit-background: var(--c-surface-dark-soft);
	--docsearch-searchbox-background: var(--c-surface-dark-soft);
	--docsearch-searchbox-focus-background: var(--c-surface-dark);
	--docsearch-hit-shadow: none;
}

@media (max-width: 900px) {
	.docsearch-root {
		min-width: 180px;
	}
}

@media (max-width: 768px) {
	.docsearch-root {
		min-width: 40px;
	}

	.docsearch-root :global(.DocSearch-Button) {
		width: 36px;
		padding: 0;
		justify-content: center;
	}

	.docsearch-root :global(.DocSearch-Button-Placeholder),
	.docsearch-root :global(.DocSearch-Button-Keys) {
		display: none;
	}
}
</style>
