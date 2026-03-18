<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

onMounted(() => {
	// 获取当前主题
	const theme = document.documentElement.getAttribute('data-theme');
	isDark.value = theme === 'dark';
});

const toggleTheme = () => {
	const html = document.documentElement;
	const currentTheme = html.getAttribute('data-theme');
	const newTheme = currentTheme === 'light' ? 'dark' : 'light';
	
	html.setAttribute('data-theme', newTheme);
	localStorage.setItem('theme', newTheme);
	isDark.value = newTheme === 'dark';
};
</script>

<template>
	<button 
		class="theme-toggle" 
		@click="toggleTheme"
		aria-label="切换主题"
	>
		<span class="theme-icon light" v-show="!isDark">☀️</span>
		<span class="theme-icon dark" v-show="isDark">🌙</span>
	</button>
</template>

<style scoped>
.theme-toggle {
	width: 40px;
	height: 40px;
	border-radius: 8px;
	border: none;
	background: transparent;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
	transition: background-color 0.2s;
	position: relative;
}

.theme-toggle:hover {
	background-color: var(--vp-c-bg-soft);
}

.theme-icon {
	position: absolute;
	transition: opacity 0.2s, transform 0.2s;
}
</style>
