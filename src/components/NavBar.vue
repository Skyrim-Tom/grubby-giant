<script setup lang="ts">
import DocSearchBox from './DocSearchBox.vue';

interface NavItem {
	href: string;
	text: string;
	matchPrefix?: boolean;
}

const props = defineProps<{
	currentPath: string;
}>();

const navItems: NavItem[] = [
	{ href: "/", text: "首页" },
	{ href: "/posts", text: "文章", matchPrefix: true },
	{ href: "/gallery", text: "相册", matchPrefix: true },
	{ href: "/about", text: "关于" },
];

const normalizePath = (path: string): string => {
	if (path === '/') return path;
	return path.replace(/\/$/, '');
};

const isActive = (item: NavItem): boolean => {
	const currentPath = normalizePath(props.currentPath);
	const href = normalizePath(item.href);
	if (href === '/') return currentPath === '/';
	return currentPath === href || Boolean(item.matchPrefix && currentPath.startsWith(href + '/'));
};
</script>

<template>
	<header class="header">
		<div class="header-container">
			<div class="brand-search">
				<!-- Logo: spike-mark + wordmark -->
				<a href="/" class="logo" aria-label="Momoc's Blog — 首页">
					<svg class="logo-mark" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="M8 1V15M1 8H15M2.929 2.929L13.071 13.071M13.071 2.929L2.929 13.071"
							stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
					</svg>
					<span class="logo-text">Momoc's Blog</span>
				</a>
				<DocSearchBox />
			</div>

			<!-- Nav links -->
			<nav class="nav" aria-label="主导航">
				<a
					v-for="item in navItems"
					:key="item.href"
					:href="item.href"
					:class="['nav-link', { active: isActive(item) }]"
					:aria-current="isActive(item) ? 'page' : undefined"
				>
					{{ item.text }}
				</a>
			</nav>

			<!-- Right actions slot -->
			<div class="header-actions">
				<slot name="actions"></slot>
			</div>
		</div>
	</header>
</template>

<style scoped>
.header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	height: var(--header-height);
	background-color: var(--c-canvas);
	border-bottom: 1px solid var(--c-hairline-soft);
	transition: background-color 0.3s, border-color 0.3s;
}

.header-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 24px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

/* ── Logo ── */
.brand-search {
	display: flex;
	align-items: center;
	gap: 18px;
	min-width: 0;
}

.logo {
	display: flex;
	align-items: center;
	gap: 10px;
	text-decoration: none;
	color: var(--c-ink);
}

.logo-mark {
	color: var(--c-primary);
	flex-shrink: 0;
	transition: transform 0.35s ease;
}

.logo:hover .logo-mark {
	transform: rotate(45deg);
}

.logo-text {
	font-family: var(--font-body);
	font-size: 0.9375rem;
	font-weight: 500;
	color: var(--c-ink);
	letter-spacing: -0.01em;
	transition: color 0.2s;
}

.logo:hover .logo-text {
	color: var(--c-primary);
}

/* ── Nav ── */
.nav {
	display: flex;
	align-items: center;
	gap: 2px;
}

.nav-link {
	padding: 6px 14px;
	border-radius: 8px;
	color: var(--c-muted);
	text-decoration: none;
	font-size: 0.875rem;
	font-weight: 500;
	line-height: 1.4;
	transition: color 0.2s, background-color 0.2s;
}

.nav-link:hover {
	color: var(--c-ink);
	background-color: var(--c-surface-card);
}

.nav-link.active {
	color: var(--c-ink);
	background-color: var(--c-surface-card);
}

/* ── Actions ── */
.header-actions {
	display: flex;
	align-items: center;
	gap: 8px;
}

/* ── Responsive ── */
@media (max-width: 768px) {
	.header-container {
		padding: 0 16px;
	}

	.brand-search {
		gap: 10px;
	}

	.nav {
		gap: 0;
	}

	.nav-link {
		padding: 6px 10px;
		font-size: 0.8125rem;
	}

	.logo-text {
		display: none;
	}
}
</style>
