---
title: "TypeScript 实用技巧分享"
description: "总结日常开发中常用的 TypeScript 技巧，包括类型推断、泛型使用、类型守卫等，帮助你写出更健壮的代码。"
pubDate: 2026-03-05
category: "技术教程"
tags: ["TypeScript", "JavaScript", "前端开发"]
readTime: "5 分钟"
featured: false
---

## 类型推断

TypeScript 可以自动推断变量类型：

```typescript
let name = "TypeScript"; // 推断为 string
let count = 42;          // 推断为 number
let isActive = true;     // 推断为 boolean
```

## 泛型使用

泛型让函数和类可以适用于多种类型：

```typescript
function identity<T>(arg: T): T {
    return arg;
}

// 使用
let output = identity<string>("myString");
let outputNum = identity<number>(100);
```

## 类型守卫

类型守卫用于在运行时检查类型：

```typescript
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function processValue(value: string | number) {
    if (isString(value)) {
        // TypeScript 知道这里 value 是 string
        console.log(value.toUpperCase());
    } else {
        // 这里 value 是 number
        console.log(value.toFixed(2));
    }
}
```

## 实用工具类型

TypeScript 提供了许多内置的工具类型：

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

// 只读类型
type ReadonlyUser = Readonly<User>;

// 部分类型
type PartialUser = Partial<User>;

// 选择属性
type UserPreview = Pick<User, 'id' | 'name'>;

// 排除属性
type UserWithoutEmail = Omit<User, 'email'>;
```

## 结语

掌握这些 TypeScript 技巧，可以让你的代码更加健壮和可维护。
