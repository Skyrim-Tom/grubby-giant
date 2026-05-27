---
name: grubby-blog-post-writer
description: 为 grubby-giant Astro 博客生成或更新 Markdown 文章。用于在 src/content/posts 下创建文章、确定文件名、front matter、分类、标签、readTime 和正文结构，确保新文章与项目现有文档风格保持一致。
---

# Grubby 博客文章生成规范

在为 grubby-giant Astro 博客编写、修改或检查文章时使用这个 skill。

## 工作流程

1. 如果当前任务没有提供足够上下文，先查看 `src/content/posts` 中已有文章的写法。
2. 文章只创建在 `src/content/posts` 目录下。
3. 文件名使用小写英文短横线命名，并以 `.md` 结尾。
4. 文件名应清晰描述主题，例如 `javascript-promise-guide.md`、`astro-docsearch-js-integration.md`、`qiankun-micro-frontend-guide.md`。
5. front matter 必须兼容 `src/content.config.ts`。
6. 除非用户明确要求其他语言，否则正文使用中文。
7. 新增或修改文章后，在条件允许时运行 `pnpm build` 验证。

## Front Matter

使用固定字段顺序：

```yaml
---
title: "文章标题"
description: "一到两句话概括文章内容。"
pubDate: YYYY-MM-DD
category: "技术教程"
tags: ["标签一", "标签二", "标签三"]
readTime: "8 分钟"
featured: false
---
```

规则：

- `title`：使用清晰的中文标题。技术名词保留原始大小写，例如 `Astro`、`Vue`、`qiankun`、`DocSearch`。
- `description`：简洁概括文章内容，便于搜索和文章列表展示，需要体现核心技术与覆盖范围。
- `pubDate`：默认使用当前本地日期，除非用户指定日期。
- `category`：复用已有分类。前端、编程、工程化文章默认使用 `"技术教程"`。
- `tags`：使用 3-6 个标签。优先复用已有标签体系，例如 `"JavaScript"`、`"Vue"`、`"Astro"`、`"前端基础"`、`"前端架构"`、`"性能优化"`、`"工具函数"`、`"网络请求"`。
- `readTime`：估算阅读时间，使用中文格式，例如 `"8 分钟"`、`"12 分钟"`、`"30 分钟"`。
- `featured`：默认使用 `false`，除非用户明确要求设为精选。

## 文章风格

- 正文以和 front matter `title` 一致的 `#` 一级标题开始。
- 优先写成实用型技术笔记，包含解释、示例、表格和清单。
- 大章节使用 `##`，小章节使用 `###`。
- 代码块使用 fenced code block，并标明语言类型。
- 表达清晰、偏实践总结，不写空泛口号。
- 覆盖面较广的知识整理类文章，需要包含对比表、常见问题、选型建议和小结。
- 如果文章依赖外部文档、现代框架或库的行为，加入 `## 参考资料` 章节。

## 验收清单

完成前检查：

- 文件是否位于 `src/content/posts`。
- 文件名是否为小写英文短横线命名。
- front matter 必填字段是否完整。
- `category`、`tags`、`readTime`、`featured` 是否符合现有项目风格。
- Markdown 标题层级是否清晰。
- 如果项目依赖已安装且可本地构建，运行 `pnpm build`。
