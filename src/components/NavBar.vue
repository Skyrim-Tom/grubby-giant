<script setup lang="ts">
import { Hexagon } from 'lucide-vue-next';

interface NavItem {
	href: string;
	text: string;
}

const props = defineProps<{
	currentPath: string;
}>();

const navItems: NavItem[] = [
	{ href: "/", text: "首页" },
	{ href: "/posts", text: "文章" },
	{ href: "/gallery", text: "相册" },
	{ href: "/about", text: "关于" },
];

const isActive = (href: string): boolean => {
	if (href === '/') {
		return props.currentPath === '/';
	}
	return props.currentPath === href || props.currentPath.startsWith(href + '/');
};
</script>

<template>
	<header class="header">
		<div class="header-container">
			<a href="/" class="logo">
				<Hexagon class="logo-icon" :stroke-width="2.5" />
				<span class="logo-text">Momoc's Blog</span>
			</a>
			
			<nav class="nav">
				<a 
					v-for="item in navItems" 
					:key="item.href"
					:href="item.href" 
					:class="['nav-link', { active: isActive(item.href) }]"
				>
					{{ item.text }}
				</a>
			</nav>

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
	background-color: var(--vp-c-bg);
	border-bottom: 1px solid var(--vp-c-divider);
	transition: background-color 0.3s, border-color 0.3s;
}

.header-container {
	max-width: 1440px;
	margin: 0 auto;
	padding: 0 24px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.logo {
	display: flex;
	align-items: center;
	gap: 8px;
	text-decoration: none;
	color: var(--vp-c-text-1);
	font-weight: 600;
	font-size: 1.25rem;
	transition: color 0.2s;
}

.logo:hover {
	color: var(--vp-c-brand-1);
}

.logo-icon {
	color: var(--vp-c-brand-1);
	width: 28px;
	height: 28px;
	transition: transform 0.3s ease;
}

.logo:hover .logo-icon {
	transform: rotate(30deg);
}

.nav {
	display: flex;
	align-items: center;
	gap: 8px;
}

.nav-link {
	padding: 0 16px;
	line-height: 36px;
	border-radius: 8px;
	color: var(--vp-c-text-2);
	text-decoration: none;
	font-size: 0.9rem;
	font-weight: 500;
	transition: all 0.2s;
}

.nav-link:hover {
	color: var(--vp-c-text-1);
	background-color: var(--vp-c-bg-soft);
}

.nav-link.active {
	color: var(--vp-c-brand-1);
	background-color: var(--vp-c-brand-soft);
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

@media (max-width: 768px) {
	.header-container {
		padding: 0 16px;
	}

	.nav {
		gap: 4px;
	}

	.nav-link {
		padding: 0 12px;
		font-size: 0.85rem;
	}

	.logo-text {
		display: none;
	}
}
</style>
