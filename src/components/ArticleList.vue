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
		<!-- 吸顶标题 -->
		<div class="list-header">
			<div class="list-eyebrow">
				<span class="eyebrow-mark" aria-hidden="true">✦</span>
				<span>ARTICLES</span>
			</div>
			<h3 class="list-title">文章列表</h3>
		</div>

		<!-- 可滚动列表 -->
		<div class="list-scroll">
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
	</div>
</template>

<style scoped>
/* 整体容器：撑满父级侧边栏高度，使用 flex 分区 */
.article-list-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

/* ── 吸顶标题区（不参与内部滚动）── */
.list-header {
	flex-shrink: 0;
	padding-top: 32px;
	padding-bottom: 16px;
	border-bottom: 1px solid var(--c-hairline-soft);
	margin-bottom: 4px;
}

.list-eyebrow {
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

.list-title {
	font-family: var(--font-display);
	font-size: 1.125rem;
	font-weight: 400;
	letter-spacing: -0.025em;
	color: var(--c-ink);
	line-height: 1.2;
}

/* ── 可滚动列表区 ── */
.list-scroll {
	flex: 1;
	overflow-y: auto;
	padding-top: 12px;
	padding-bottom: 40px;
	/* 隐藏滚动条 */
	scrollbar-width: none;
}

.list-scroll::-webkit-scrollbar {
	display: none;
}

/* ── 分类组 ── */
.category-group {
	margin-bottom: 8px;
}

.category-label {
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 0.6875rem;
	font-weight: 500;
	color: var(--c-primary);
	text-transform: uppercase;
	letter-spacing: 0.08em;
	padding: 8px 8px 4px;
}

.category-icon {
	font-size: 0.6rem;
	line-height: 1;
}

/* ── 文章链接 ── */
.article-nav {
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.article-nav-item {
	display: block;
	padding: 7px 10px;
	border-radius: 6px;
	color: var(--c-body);
	text-decoration: none;
	font-size: 0.875rem;
	line-height: 1.4;
	font-weight: 400;
	transition: background 0.15s, color 0.15s;
	border-left: 2px solid transparent;
}

.article-nav-item:hover {
	color: var(--c-ink);
	background: var(--c-surface-card);
}

.article-nav-item.active {
	color: var(--c-primary);
	background: transparent;
	border-left-color: var(--c-primary);
	font-weight: 500;
	padding-left: 12px;
}
</style>
