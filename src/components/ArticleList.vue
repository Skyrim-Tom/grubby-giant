<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

interface Post {
	id: string;
	data: {
		title: string;
		category: string;
	};
}

const props = defineProps<{
	posts: Post[];
}>();

const currentPath = ref('');

const updateCurrentPath = () => {
	currentPath.value = window.location.pathname.replace(/\/$/, '');
};

const isCurrentPost = (postId: string) => currentPath.value === `/posts/${postId}`;

// 按分类分组
const groupedPosts = computed(() => {
	const groups: Record<string, Post[]> = {};
	for (const post of props.posts) {
		const cat = post.data.category;
		if (!groups[cat]) groups[cat] = [];
		groups[cat].push(post);
	}
	return groups;
});

// 分类顺序（按第一篇出现顺序）
const categories = computed(() => Object.keys(groupedPosts.value));

onMounted(() => {
	updateCurrentPath();
	document.addEventListener('astro:page-load', updateCurrentPath);
});

onUnmounted(() => {
	document.removeEventListener('astro:page-load', updateCurrentPath);
});
</script>

<template>
	<div class="article-list-container">
		<h3 class="list-title">文章列表</h3>
		<div class="category-group" v-for="cat in categories" :key="cat">
			<div class="category-label">
				<span class="category-icon">▸</span>
				{{ cat }}
			</div>
			<nav class="article-nav">
				<a
					v-for="post in groupedPosts[cat]"
					:key="post.id"
					:href="`/posts/${post.id}`"
					:class="['article-nav-item', { active: isCurrentPost(post.id) }]"
				>
					{{ post.data.title }}
				</a>
			</nav>
		</div>
	</div>
</template>

<style scoped>
.article-list-container {
	background: var(--vp-c-bg-elv);
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	padding: 20px;
}

.list-title {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--vp-c-text-1);
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin-bottom: 16px;
	padding-bottom: 12px;
	border-bottom: 1px solid var(--vp-c-divider);
}

.category-group {
	margin-bottom: 12px;
}

.category-group:last-child {
	margin-bottom: 0;
}

.category-label {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--vp-c-brand-1);
	text-transform: uppercase;
	letter-spacing: 0.06em;
	padding: 6px 8px;
	margin-bottom: 2px;
}

.category-icon {
	font-size: 0.65rem;
	line-height: 1;
}

.article-nav {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.article-nav-item {
	display: block;
	padding: 8px 12px;
	border-radius: 6px;
	color: var(--vp-c-text-2);
	text-decoration: none;
	font-size: 0.875rem;
	line-height: 1.4;
	font-weight: 400;
	transition: all 0.2s;
	border-left: 2px solid transparent;
}

.article-nav-item:hover {
	color: var(--vp-c-text-1);
	background: var(--vp-c-bg-soft);
}

.article-nav-item.active {
	color: var(--vp-c-brand-1);
	background: var(--vp-c-brand-soft);
	border-left-color: var(--vp-c-brand-1);
	font-weight: 500;
}
</style>
