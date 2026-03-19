<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sun, Moon, Github } from 'lucide-vue-next';

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
	<div class="header-actions">
		<!-- GitHub 链接 -->
		<a 
			href="https://github.com/Skyrim-Tom/grubby-giant" 
			target="_blank" 
			rel="noopener noreferrer"
			class="github-link"
			aria-label="GitHub"
		>
			<Github class="github-icon" />
		</a>

		<!-- 主题切换开关 -->
		<button 
			class="theme-switch" 
			@click="toggleTheme"
			aria-label="切换主题"
			:class="{ 'is-dark': isDark }"
		>
			<div class="switch-track">
				<div class="switch-thumb">
					<Sun class="switch-icon sun" :size="14" />
					<Moon class="switch-icon moon" :size="14" />
				</div>
			</div>
		</button>
	</div>
</template>

<style scoped>
.header-actions {
	display: flex;
	align-items: center;
	gap: 8px;
}

/* GitHub 链接 */
.github-link {
	width: 36px;
	height: 36px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--vp-c-text-2);
	background: transparent;
	transition: all 0.2s ease;
	text-decoration: none;
}

.github-link:hover {
	color: var(--vp-c-text-1);
	background-color: var(--vp-c-bg-soft);
	transform: translateY(-1px);
}

.github-icon {
	width: 20px;
	height: 20px;
}

/* 主题切换开关 */
.theme-switch {
	width: 52px;
	height: 28px;
	padding: 0;
	border: none;
	background: transparent;
	cursor: pointer;
	position: relative;
}

.switch-track {
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
	border-radius: 14px;
	position: relative;
	transition: background 0.3s ease;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-switch.is-dark .switch-track {
	background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
}

.switch-thumb {
	position: absolute;
	top: 2px;
	left: 2px;
	width: 24px;
	height: 24px;
	background: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.theme-switch.is-dark .switch-thumb {
	transform: translateX(24px);
}

.switch-icon {
	position: absolute;
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.switch-icon.sun {
	color: #f59e0b;
	opacity: 1;
	transform: scale(1) rotate(0deg);
}

.switch-icon.moon {
	color: #6366f1;
	opacity: 0;
	transform: scale(0.5) rotate(-90deg);
}

.theme-switch.is-dark .switch-icon.sun {
	opacity: 0;
	transform: scale(0.5) rotate(90deg);
}

.theme-switch.is-dark .switch-icon.moon {
	opacity: 1;
	transform: scale(1) rotate(0deg);
}

/* 悬停效果 */
.theme-switch:hover .switch-track {
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 0 0 2px var(--vp-c-brand-soft);
}

.theme-switch:hover .switch-thumb {
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
}
</style>
