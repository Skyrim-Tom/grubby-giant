---
title: "Vue 3 Composition API 最佳实践"
description: "探讨 Vue 3 Composition API 的使用方法和最佳实践，包括 setup 语法糖、响应式原理、组合式函数等核心概念。"
pubDate: 2026-02-28
category: "技术教程"
tags: ["Vue.js", "前端框架", "Composition API"]
readTime: "12 分钟"
featured: false
---

## 为什么选择 Composition API？

Composition API 提供了更灵活的代码组织方式，特别适合大型项目。

## 基础用法

使用 `<script setup>` 语法糖：

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式状态
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

// 方法
function increment() {
  count.value++
}

// 生命周期
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

## 组合式函数

将逻辑封装成可复用的函数：

```typescript
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

使用组合式函数：

```vue
<script setup>
import { useMouse } from './useMouse'

const { x, y } = useMouse()
</script>

<template>
  <div>Mouse: {{ x }}, {{ y }}</div>
</template>
```

## 响应式原理

Vue 3 使用 Proxy 实现响应式：

```javascript
import { reactive, readonly } from 'vue'

const state = reactive({
  count: 0
})

// 只读状态
const readonlyState = readonly(state)
```

## 最佳实践

1. **按功能组织代码**：将相关的逻辑放在一起
2. **使用组合式函数**：提取可复用的逻辑
3. **合理使用响应式**：避免过度使用 `ref` 和 `reactive`
4. **类型安全**：使用 TypeScript 增强代码健壮性

## 结语

Composition API 让 Vue 3 的开发体验更加灵活和强大，是现代 Vue 项目的首选方式。
