<script setup lang="ts">
import { Sun, Moon, Github } from 'lucide-vue-next';

const toggleTheme = () => {
	const html = document.documentElement;
	const currentTheme = html.getAttribute('data-theme');
	const newTheme = currentTheme === 'light' ? 'dark' : 'light';
	html.setAttribute('data-theme', newTheme);
	localStorage.setItem('theme', newTheme);
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
			aria-label="GitHub 仓库"
		>
			<Github class="github-icon" />
		</a>

		<!-- 主题切换开关 -->
		<button
			class="theme-switch"
			@click="toggleTheme"
			aria-label="切换明暗主题"
		>
			<div class="switch-track">
				<div class="switch-thumb">
					<Sun class="switch-icon sun" :size="13" />
					<Moon class="switch-icon moon" :size="13" />
				</div>
			</div>
		</button>
	</div>
</template>

<style scoped>
.header-actions {
	display: flex;
	align-items: center;
	gap: 6px;
}

/* ── GitHub link ── */
.github-link {
	width: 36px;
	height: 36px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--c-muted);
	text-decoration: none;
	transition: color 0.2s, background-color 0.2s;
}

.github-link:hover {
	color: var(--c-ink);
	background-color: var(--c-surface-card);
}

.github-icon {
	width: 18px;
	height: 18px;
}

/* ── Theme switch ── */
.theme-switch {
	width: 48px;
	height: 26px;
	padding: 0;
	border: none;
	background: transparent;
	cursor: pointer;
}

.switch-track {
	width: 100%;
	height: 100%;
	/* Light mode: warm cream tones */
	background: var(--c-surface-cream-strong);
	border: 1px solid var(--c-hairline);
	border-radius: 13px;
	position: relative;
	transition: background 0.3s, border-color 0.3s;
}

[data-theme="dark"] .theme-switch .switch-track {
	background: var(--c-surface-dark-elevated);
	border-color: rgba(250,249,245,0.15);
}

.switch-thumb {
	position: absolute;
	top: 2px;
	left: 2px;
	width: 20px;
	height: 20px;
	background: var(--c-canvas);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s;
	box-shadow: 0 1px 3px rgba(20,20,19,0.15);
}

[data-theme="dark"] .theme-switch .switch-thumb {
	transform: translateX(22px);
	background: var(--c-surface-card);
}

.switch-icon {
	position: absolute;
	transition: opacity 0.2s, transform 0.2s;
}

.switch-icon.sun {
	color: var(--c-amber);
	opacity: 1;
	transform: scale(1);
}

.switch-icon.moon {
	color: var(--c-on-dark-soft);
	opacity: 0;
	transform: scale(0.5);
}

[data-theme="dark"] .switch-icon.sun {
	opacity: 0;
	transform: scale(0.5);
}

[data-theme="dark"] .switch-icon.moon {
	opacity: 1;
	transform: scale(1);
}

.theme-switch:hover .switch-track {
	border-color: var(--c-primary);
}
</style>
