<script setup lang="ts">
interface Post {
	id: string;
	data: {
		title: string;
		category: string;
	};
}

const props = defineProps<{
	posts: Post[];
	currentPostId: string;
}>();
</script>

<template>
	<div class="article-list-container">
		<h3 class="list-title">文章列表</h3>
		<nav class="article-nav">
			<a
				v-for="post in posts"
				:key="post.id"
				:href="`/posts/${post.id}`"
				:class="[
					'article-nav-item',
					{ active: post.id === currentPostId }
				]"
			>
				<span class="nav-item-category">{{ post.data.category }}</span>
				<span class="nav-item-title">{{ post.data.title }}</span>
			</a>
		</nav>
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

.article-nav {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.article-nav-item {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 10px 12px;
	border-radius: 8px;
	color: var(--vp-c-text-1);
	text-decoration: none;
	transition: all 0.2s;
	border-left: 3px solid transparent;
}

.article-nav-item:hover {
	background: var(--vp-c-bg-soft);
}

.article-nav-item.active {
	background: var(--vp-c-brand-soft);
	border-left-color: var(--vp-c-brand-1);
}

.nav-item-category {
	font-size: 0.75rem;
	color: var(--vp-c-brand-1);
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.nav-item-title {
	font-size: 0.875rem;
	line-height: 1.4;
	color: var(--vp-c-text-1);
	font-weight: 500;
}

.article-nav-item:hover .nav-item-title {
	color: var(--vp-c-brand-1);
}
</style>
