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
		<h3 class="toc-title">目录</h3>
		<nav class="toc-nav">
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
	</div>
</template>

<style scoped>
.toc-container {
	background: var(--vp-c-bg-elv);
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	padding: 20px;
}

.toc-title {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--vp-c-text-1);
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin-bottom: 16px;
	padding-bottom: 12px;
	border-bottom: 1px solid var(--vp-c-divider);
}

.toc-nav {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.toc-link {
	display: block;
	padding: 6px 10px;
	border-radius: 6px;
	color: var(--vp-c-text-2);
	text-decoration: none;
	font-size: 0.8125rem;
	line-height: 1.5;
	transition: all 0.2s;
	border-left: 2px solid transparent;
}

.toc-link:hover {
	color: var(--vp-c-text-1);
	background: var(--vp-c-bg-soft);
}

.toc-link.active {
	color: var(--vp-c-brand-1);
	background: var(--vp-c-brand-soft);
	border-left-color: var(--vp-c-brand-1);
	font-weight: 500;
}

.toc-level-3 {
	padding-left: 20px;
	font-size: 0.75rem;
}
</style>
