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
		<div class="post-meta">
			<span class="post-category">{{ post.data.category }}</span>
			<time class="post-date" :datetime="formatDate(post.data.pubDate)">
				{{ formatDate(post.data.pubDate) }}
			</time>
		</div>
		<h3 class="post-title">
			<a :href="`/posts/${post.id}`">{{ post.data.title }}</a>
		</h3>
		<p class="post-excerpt">{{ post.data.description }}</p>
		<a :href="`/posts/${post.id}`" class="post-link" aria-label="`阅读 ${post.data.title}`">
			阅读更多
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
				<path d="M5 12h14M12 5l7 7-7 7"/>
			</svg>
		</a>
	</article>
</template>

<style scoped>
.post-card {
	background: var(--c-surface-card);
	border-radius: 12px;
	padding: 28px 32px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	transition: transform 0.2s ease;
}

.post-card:hover {
	transform: translateY(-2px);
}

/* ── Meta row ── */
.post-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.post-category {
	font-size: 0.6875rem;
	font-weight: 500;
	color: var(--c-primary);
	text-transform: uppercase;
	letter-spacing: 1.5px;
}

.post-date {
	font-size: 0.8125rem;
	color: var(--c-muted);
}

/* ── Title ── */
.post-title {
	font-family: var(--font-display);
	font-size: 1.375rem;
	font-weight: 500;
	line-height: 1.25;
	letter-spacing: -0.025em;
}

.post-title a {
	color: var(--c-ink);
	text-decoration: none;
	transition: color 0.2s;
}

.post-title a:hover {
	color: var(--c-primary);
}

/* ── Excerpt ── */
.post-excerpt {
	font-size: 0.9375rem;
	color: var(--c-body);
	line-height: 1.6;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* ── Link ── */
.post-link {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	color: var(--c-primary);
	text-decoration: none;
	font-size: 0.8125rem;
	font-weight: 500;
	margin-top: 4px;
	transition: gap 0.2s;
}

.post-link:hover {
	gap: 10px;
}

.post-link svg {
	flex-shrink: 0;
	transition: transform 0.2s;
}
</style>
