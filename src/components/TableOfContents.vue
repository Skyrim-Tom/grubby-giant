<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Heading {
	slug: string;
	text: string;
	depth: number;
}

const props = defineProps<{
	headings: Heading[];
}>();

const activeId = ref('');
let observer: IntersectionObserver | null = null;

onMounted(() => {
	// 获取所有标题元素
	const headingElements = document.querySelectorAll('#article-content :is(h2, h3)');

	// 创建 IntersectionObserver
	observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					activeId.value = entry.target.getAttribute('id') || '';
				}
			});
		},
		{
			root: null,
			rootMargin: '-80px 0px -60% 0px',
			threshold: 0,
		}
	);

	headingElements.forEach((heading) => observer?.observe(heading));
});

onUnmounted(() => {
	observer?.disconnect();
});

const scrollToHeading = (slug: string) => {
	const target = document.getElementById(slug);
	if (target) {
		const headerOffset = 80;
		const elementPosition = target.getBoundingClientRect().top;
		const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth',
		});

		history.pushState(null, '', `#${slug}`);
	}
};
</script>

<template>
	<div class="toc-container">
		<div class="toc-header">
			<div class="toc-eyebrow">
				<span class="eyebrow-mark" aria-hidden="true">✦</span>
				<span>ON THIS PAGE</span>
			</div>
			<h3 class="toc-title">目录</h3>
		</div>
		<nav class="toc-nav" v-if="headings.length > 0">
			<a
				v-for="heading in headings"
				:key="heading.slug"
				:href="`#${heading.slug}`"
				:class="[
					'toc-link',
					`toc-level-${heading.depth}`,
					{ active: activeId === heading.slug }
				]"
				@click.prevent="scrollToHeading(heading.slug)"
			>
				{{ heading.text }}
			</a>
		</nav>
		<p class="toc-empty" v-else>暂无目录</p>
	</div>
</template>

<style scoped>
.toc-container {
	padding-top: 32px;
}

/* ── Header ── */
.toc-header {
	margin-bottom: 16px;
}

.toc-eyebrow {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 0.625rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 1.5px;
	color: var(--c-muted);
	margin-bottom: 8px;
}

.eyebrow-mark {
	color: var(--c-primary);
}

.toc-title {
	font-family: var(--font-display);
	font-size: 1rem;
	font-weight: 400;
	letter-spacing: -0.02em;
	color: var(--c-ink);
	line-height: 1.2;
	padding-bottom: 14px;
	border-bottom: 1px solid var(--c-hairline-soft);
}

/* ── Nav ── */
.toc-nav {
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.toc-link {
	display: block;
	padding: 5px 10px;
	border-radius: 5px;
	color: var(--c-muted);
	text-decoration: none;
	font-size: 0.8125rem;
	line-height: 1.5;
	transition: color 0.15s, background 0.15s;
	border-left: 2px solid transparent;
}

.toc-link:hover {
	color: var(--c-ink);
	background: var(--c-surface-card);
}

.toc-link.active {
	color: var(--c-primary);
	border-left-color: var(--c-primary);
	font-weight: 500;
	padding-left: 12px;
}

.toc-level-3 {
	padding-left: 18px;
	font-size: 0.75rem;
}

.toc-level-3.active {
	padding-left: 20px;
}

.toc-empty {
	font-size: 0.8125rem;
	color: var(--c-muted);
	padding: 8px 10px;
}
</style>
