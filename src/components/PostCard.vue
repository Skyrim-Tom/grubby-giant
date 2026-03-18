<script setup lang="ts">
interface Post {
	id: string;
	data: {
		title: string;
		description: string;
		pubDate: Date;
		category: string;
		readTime?: string;
	};
}

const props = defineProps<{
	post: Post;
}>();

const formatDate = (date: Date): string => {
	return new Date(date).toISOString().split('T')[0];
};
</script>

<template>
	<article class="post-card">
		<div class="post-card-header">
			<span class="post-category">{{ post.data.category }}</span>
			<time class="post-date">{{ formatDate(post.data.pubDate) }}</time>
		</div>
		<h3 class="post-card-title">
			<a :href="`/posts/${post.id}`">{{ post.data.title }}</a>
		</h3>
		<p class="post-card-excerpt">{{ post.data.description }}</p>
		<a :href="`/posts/${post.id}`" class="post-card-link">
			阅读更多
			<svg class="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M5 12h14M12 5l7 7-7 7"/>
			</svg>
		</a>
	</article>
</template>

<style scoped>
.post-card {
	background: var(--vp-c-bg-elv);
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	padding: 24px;
	transition: all 0.2s;
}

.post-card:hover {
	border-color: var(--vp-c-brand-1);
	box-shadow: var(--vp-shadow-2);
	transform: translateY(-2px);
}

.post-card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.post-category {
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--vp-c-brand-1);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.post-date {
	font-size: 0.875rem;
	color: var(--vp-c-text-3);
}

.post-card-title {
	font-size: 1.125rem;
	font-weight: 600;
	margin-bottom: 12px;
	line-height: 1.4;
}

.post-card-title a {
	color: var(--vp-c-text-1);
	text-decoration: none;
	transition: color 0.2s;
}

.post-card-title a:hover {
	color: var(--vp-c-brand-1);
}

.post-card-excerpt {
	font-size: 0.9375rem;
	color: var(--vp-c-text-2);
	line-height: 1.6;
	margin-bottom: 16px;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.post-card-link {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	color: var(--vp-c-brand-1);
	text-decoration: none;
	font-size: 0.875rem;
	font-weight: 500;
}

.link-arrow {
	width: 16px;
	height: 16px;
	transition: transform 0.2s;
}

.post-card-link:hover .link-arrow {
	transform: translateX(4px);
}
</style>
