---
title: "Codex 指令完整整理：CLI、斜杠命令与常用工作流"
description: "系统整理 OpenAI Codex 在命令行、交互式终端、桌面 App 和 IDE 扩展中的常用指令，覆盖安装登录、模型切换、权限控制、代码审查、MCP、插件、会话管理和自动化执行。"
pubDate: 2026-05-29
category: "技术教程"
tags: ["Codex", "AI Agent", "CLI", "开发工具", "工程化"]
readTime: "15 分钟"
featured: false
---

# Codex 指令完整整理：CLI、斜杠命令与常用工作流

Codex 现在不只是一个简单的代码生成工具，它同时覆盖了命令行、交互式 TUI、桌面 App、IDE 扩展、云端任务、MCP、插件、Skills、代码审查和自动化执行等场景。

这篇文章按使用入口来整理 Codex 的指令体系：

- 终端命令：在系统 shell 里执行，例如 `codex`、`codex exec`、`codex mcp`
- CLI 斜杠命令：进入 Codex 交互式终端后输入，例如 `/model`、`/permissions`、`/review`
- Codex App 斜杠命令：在桌面 App 的对话输入框里输入，例如 `/goal`、`/status`
- IDE 扩展命令：在 VS Code / Cursor 等编辑器命令面板里调用，例如 `chatgpt.newChat`

> 说明：Codex 更新很快，本文按 2026-05-29 官方文档整理。不同版本、不同账号权限、不同平台可能会看到略有差异的命令列表。遇到不确定时，优先执行 `codex --help`、在 Codex 内输入 `/`，或者查看官方文档。

## 一、先理解 Codex 的指令分类

| 类型 | 使用位置 | 典型指令 | 适合场景 |
| --- | --- | --- | --- |
| CLI 命令 | PowerShell、Terminal、Bash、Zsh | `codex`、`codex exec`、`codex login` | 启动 Codex、登录、自动化任务、管理配置 |
| CLI 斜杠命令 | `codex` 启动后的交互式 TUI | `/model`、`/diff`、`/compact` | 会话内切换模型、查看 diff、压缩上下文 |
| App 斜杠命令 | Codex 桌面 App 输入框 | `/goal`、`/plan`、`/review` | 桌面多线程工作、目标模式、代码审查 |
| IDE 命令 | 编辑器命令面板 | `chatgpt.addToThread` | 把当前文件、选中代码加入 Codex 上下文 |
| 配置/扩展命令 | CLI 或会话内 | `codex mcp`、`/plugins`、`/skills` | 接入外部工具、插件、技能和项目规则 |

简单记忆：

- 想从终端启动或自动化：用 `codex ...`
- 已经进入交互式 Codex：用 `/...`
- 想让 Codex 理解当前编辑器文件：用 IDE 命令或 `/ide`
- 想让 Codex 接入外部能力：看 `mcp`、`plugins`、`skills`

## 二、Codex CLI 常用全局参数

全局参数可以跟在 `codex` 或子命令后面，用来控制模型、工作目录、权限、沙盒、图片输入和搜索等行为。

| 参数 | 用法示例 | 作用 |
| --- | --- | --- |
| `--cd, -C <path>` | `codex --cd D:\project` | 指定 Codex 工作目录 |
| `--model, -m <model>` | `codex -m gpt-5.4` | 临时指定本次使用的模型 |
| `--profile, -p <name>` | `codex -p work` | 加载指定 profile 配置 |
| `--sandbox, -s <mode>` | `codex -s workspace-write` | 设置命令沙盒策略 |
| `--ask-for-approval, -a <mode>` | `codex -a on-request` | 设置什么时候需要人工批准 |
| `--image, -i <path>` | `codex -i screenshot.png "还原这个页面"` | 给初始提示词附加图片 |
| `--search` | `codex --search "查一下最新文档"` | 启用实时网页搜索 |
| `--config, -c key=value` | `codex -c model_reasoning_effort=\"high\"` | 临时覆盖配置 |
| `--add-dir <path>` | `codex --add-dir D:\shared` | 给额外目录写入权限 |
| `--oss` | `codex --oss` | 使用本地开源模型提供方 |
| `--yolo` | `codex --yolo` | 跳过审批和沙盒，风险很高 |

常用权限和沙盒组合：

| 场景 | 推荐参数 | 说明 |
| --- | --- | --- |
| 只想让 Codex 阅读项目 | `-s read-only` | 适合代码解释、排查问题、做 review |
| 允许改当前项目文件 | `-s workspace-write` | 日常开发最常用 |
| 非交互自动化任务 | `codex exec -a never -s workspace-write` | 配合 CI 或脚本使用 |
| 隔离环境里的快速实验 | `--yolo` | 只建议在容器、临时目录或可丢弃环境使用 |

示例：

```bash
codex --cd ./my-app -s workspace-write -a on-request
```

这条命令会在 `./my-app` 里启动 Codex，允许它修改工作区文件，但遇到高风险命令时仍需要你确认。

## 三、Codex CLI 子命令总览

### 1. `codex`

启动 Codex 交互式终端 UI。

```bash
codex
```

也可以直接带上初始任务：

```bash
codex "阅读这个项目，整理启动方式和主要模块"
```

适合日常结对编程、改 bug、写功能、解释代码、生成测试、做局部重构。

### 2. `codex app`

启动 Codex 桌面 App。

```bash
codex app
```

如果你更喜欢多线程、工作树、可视化任务管理和桌面体验，用 App 会更舒服。

### 3. `codex exec`

非交互模式执行任务，适合脚本、CI、批处理。

```bash
codex exec "检查当前项目是否有明显的 TypeScript 类型问题"
```

常用参数：

| 参数 | 示例 | 作用 |
| --- | --- | --- |
| `--json` | `codex exec --json "..."` | 输出 JSONL 事件，方便程序消费 |
| `--output-last-message, -o` | `codex exec -o result.md "生成总结"` | 把最后回复写入文件 |
| `--output-schema` | `codex exec --output-schema schema.json "..."` | 要求最终输出符合 JSON Schema |
| `--ephemeral` | `codex exec --ephemeral "..."` | 不持久化会话记录 |
| `--skip-git-repo-check` | `codex exec --skip-git-repo-check "..."` | 允许在非 Git 目录执行 |
| `--image, -i` | `codex exec -i ui.png "指出布局问题"` | 给任务附加图片 |

从标准输入读取任务：

```bash
cat prompt.md | codex exec -
```

恢复上一次非交互任务：

```bash
codex exec resume --last
```

典型用法：

```bash
codex exec --cd ./packages/web -s workspace-write -a never \
  "修复 ESLint 报错，并在最后列出修改文件"
```

### 4. `codex login` / `codex logout`

登录和退出 Codex。

```bash
codex login
codex logout
```

登录一般可以选择 ChatGPT 账号、API Key 或访问令牌等方式。共享电脑上用完建议执行 `codex logout`。

### 5. `codex resume`

恢复之前的交互式会话。

```bash
codex resume
codex resume --last
```

适合继续昨天没做完的任务，或者重新打开一个已有上下文的长会话。

### 6. `codex fork`

从已有会话分叉出新线程。

```bash
codex fork
```

适合探索另一种实现方案：原来的会话不动，新会话继承上下文继续试验。

### 7. `codex apply`

把 Codex Cloud 任务产生的最新 diff 应用到本地工作树。

```bash
codex apply
codex a
```

适合你把任务交给 Codex Cloud 跑完后，在本地接收修改。

### 8. `codex cloud`

从终端浏览或执行 Codex Cloud 任务。

```bash
codex cloud
```

也可以使用别名：

```bash
codex cloud-tasks
```

### 9. `codex mcp`

管理 MCP 服务器。MCP 可以让 Codex 接入外部工具、数据库、浏览器、内部服务或自定义上下文。

```bash
codex mcp list
codex mcp add my-server --url http://localhost:3000/mcp
codex mcp remove my-server
```

常见用途：

- 接入官方或团队内部文档
- 接入数据库查询工具
- 接入浏览器自动化能力
- 接入 Figma、GitHub、Linear 等外部系统

### 10. `codex mcp-server`

把 Codex 自身作为 MCP Server 暴露给其他工具使用。

```bash
codex mcp-server
```

这个更偏高级集成，一般个人日常开发不一定用得到。

### 11. `codex completion`

生成 shell 自动补全脚本。

```bash
codex completion bash
codex completion zsh
codex completion fish
codex completion powershell
```

配置完成后，可以在终端里补全 `codex` 子命令和参数。

### 12. `codex features`

查看、启用、禁用 Codex 功能开关。

```bash
codex features list
codex features enable goals
codex features disable goals
```

适合开启某些实验能力，例如 goals、subagents、插件相关功能等。不同版本可用功能会变化，以 `codex features list` 为准。

### 13. `codex plugin marketplace`

管理插件市场来源。

```bash
codex plugin marketplace list
codex plugin marketplace add <source>
codex plugin marketplace remove <name>
codex plugin marketplace upgrade <name>
```

插件适合把一组 Skills、MCP、工具和应用能力打包复用。

### 14. `codex sandbox`

在 Codex 提供的沙盒里运行命令。

```bash
codex sandbox -- npm test
```

适合想隔离执行某些命令时使用。具体能力会跟平台有关，例如 macOS、Linux、Windows 的沙盒实现不完全一样。

### 15. `codex update`

检查并更新 Codex CLI。

```bash
codex update
```

如果你是 npm 或 Homebrew 安装，也可以继续用对应包管理器升级：

```bash
npm install -g @openai/codex@latest
brew upgrade --cask codex
```

### 16. `codex debug ...`

调试 Codex 本身或查看内部信息。

```bash
codex debug models
codex debug app-server send-message-v2
```

常见用途：

- 查看当前模型目录
- 排查 app-server 通信问题
- 给问题反馈准备诊断信息

### 17. `codex app-server` / `codex remote-control`

面向本地开发、远程控制或桌面 App 相关集成。

```bash
codex app-server
codex remote-control
```

这类命令更偏 Codex 插件、桌面 App、远程会话和调试场景。日常写代码时可以先不用管，等需要做自动化集成时再研究。

## 四、Codex CLI 斜杠命令完整整理

进入 `codex` 交互式终端后，在输入框里输入 `/` 可以打开命令列表。斜杠命令的特点是：不用退出当前会话，就能调整模型、权限、上下文、插件、会话和显示方式。

### 会话和上下文类

| 命令 | 作用 | 常用场景 |
| --- | --- | --- |
| `/new` | 在当前 CLI 内开始新会话 | 同一个项目切换到新任务 |
| `/clear` | 清空终端并开始新聊天 | 想重置可见 UI 和对话 |
| `/compact` | 总结已有对话，释放上下文 | 长任务中途上下文快满 |
| `/resume` | 恢复保存过的会话 | 回到之前的任务 |
| `/fork` | 分叉当前会话 | 尝试另一种方案 |
| `/side` | 开启临时旁路会话 | 临时问一个不想污染主线的问题 |
| `/quit` | 退出 CLI | 结束当前 Codex 会话 |
| `/exit` | 退出 CLI | `/quit` 的同义命令 |

示例：

```text
/compact
/fork
/side 帮我检查这个迁移方案有没有明显风险
```

### 模型、速度和沟通风格类

| 命令 | 作用 | 常用场景 |
| --- | --- | --- |
| `/model` | 切换模型和推理强度 | 大任务切强模型，小任务切轻量模型 |
| `/fast` | 开关 Fast 服务层 | 想提高响应速度时 |
| `/personality` | 切换回复风格 | 想更简洁、更协作或关闭风格指令 |
| `/status` | 查看当前会话配置和 token 使用 | 确认模型、权限、上下文余量 |

示例：

```text
/model
/fast status
/personality
/status
```

### 权限、安全和执行控制类

| 命令 | 作用 | 常用场景 |
| --- | --- | --- |
| `/permissions` | 调整审批和权限模式 | 从只读切到允许编辑，或反过来收紧 |
| `/approve` | 批准一次被自动审查拒绝的重试 | 某个动作被拦截但你确认可以执行 |
| `/sandbox-add-read-dir` | Windows 下给额外目录读权限 | 命令需要读取当前根目录外的绝对路径 |
| `/ps` | 查看后台终端和最近输出 | 长命令还在跑，想看状态 |
| `/stop` | 停止后台终端 | 停掉当前会话启动的后台任务 |

示例：

```text
/permissions
/sandbox-add-read-dir C:\Users\me\Downloads
/ps
/stop
```

### 代码变更和审查类

| 命令 | 作用 | 常用场景 |
| --- | --- | --- |
| `/diff` | 查看 Git diff，包括未跟踪文件 | 提交前检查 Codex 改了什么 |
| `/review` | 让 Codex 审查工作区变更 | 想找 bug、风险和漏测点 |
| `/copy` | 复制最近一次 Codex 输出 | 复制总结、计划或 review 结果 |
| `/raw` | 切换原始滚动模式 | 复制长日志或长输出更方便 |

示例：

```text
/diff
/review
/copy
/raw on
```

### 工具、文件和扩展类

| 命令 | 作用 | 常用场景 |
| --- | --- | --- |
| `/mention` | 把文件或目录加入上下文 | 明确让 Codex 关注某个文件 |
| `/ide` | 加入当前 IDE 打开的文件和选区 | 和编辑器联动 |
| `/mcp` | 查看 MCP 工具状态 | 确认外部工具是否可用 |
| `/plugins` | 浏览、安装、管理插件 | 使用插件打包能力 |
| `/apps` | 浏览 apps/connectors 并插入提示 | 在提示里引用连接器 |
| `/skills` | 浏览并使用 Skills | 让任务遵循特定工作流 |
| `/hooks` | 查看和管理生命周期 hooks | 检查 hooks 是否可信、是否启用 |
| `/memories` | 配置记忆使用和生成 | 控制 Codex 是否注入或生成记忆 |

示例：

```text
/mention src/api/user.ts
/ide 看一下我当前选中的代码为什么类型报错
/mcp verbose
/skills
```

### 显示、键位和偏好类

| 命令 | 作用 | 常用场景 |
| --- | --- | --- |
| `/theme` | 选择语法高亮主题 | 调整终端显示风格 |
| `/statusline` | 配置底部状态栏字段 | 显示模型、token、Git 分支等 |
| `/title` | 配置终端窗口标题 | 多窗口开发时更容易识别 |
| `/keymap` | 修改 TUI 快捷键 | 自定义键盘操作 |
| `/vim` | 切换输入框 Vim 模式 | Vim 用户更顺手 |

示例：

```text
/theme
/statusline
/keymap
/vim
```

### 账号、反馈和初始化类

| 命令 | 作用 | 常用场景 |
| --- | --- | --- |
| `/init` | 生成 `AGENTS.md` 脚手架 | 给项目写 Codex 持久规则 |
| `/logout` | 退出当前 Codex 登录 | 共享电脑或切换账号 |
| `/feedback` | 提交反馈和日志 | 反馈问题或给维护者发诊断信息 |
| `/experimental` | 开关实验功能 | 尝试新能力 |
| `/debug-config` | 查看配置层和策略诊断 | 排查配置为什么没生效 |

示例：

```text
/init
/debug-config
/experimental
/logout
```

## 五、Codex App 里的斜杠命令

Codex 桌面 App 也支持在输入框里输入 `/`。App 里的命令更强调任务管理、目标模式和可视化工作流。

| 命令 | 作用 | 场景 |
| --- | --- | --- |
| `/feedback` | 打开反馈窗口，可附带日志 | 反馈 App 问题 |
| `/goal` | 设置持久目标 | 让 Codex 持续推进一个较大任务 |
| `/mcp` | 打开 MCP 状态 | 查看已连接服务器 |
| `/plan` | 切换计划模式 | 先讨论方案，再执行 |
| `/review` | 开启代码审查模式 | 审查未提交变更或对比基准分支 |
| `/status` | 查看线程 ID、上下文、速率限制 | 排查状态和额度 |

典型流程：

```text
/plan 先帮我拆解把项目迁移到 Vue 3.5 的步骤
/goal 按刚才计划完成迁移，保持构建和测试通过
/review
```

App 还支持 `$` 显式调用 Skills。比如项目里有专门的博客写作技能、文档处理技能、表格处理技能时，可以在输入框里输入 `$` 选择对应技能。

## 六、Codex IDE 扩展命令

在 VS Code、Cursor、Windsurf 等编辑器里，Codex 扩展提供命令面板命令。打开命令面板：

- macOS：`Cmd + Shift + P`
- Windows / Linux：`Ctrl + Shift + P`

常用命令：

| 命令 ID | 作用 |
| --- | --- |
| `chatgpt.addToThread` | 把当前选中的代码范围加入当前线程上下文 |
| `chatgpt.addFileToThread` | 把整个文件加入当前线程上下文 |
| `chatgpt.newChat` | 创建新线程 |
| `chatgpt.implementTodo` | 让 Codex 处理选中的 TODO 注释 |
| `chatgpt.newCodexPanel` | 创建新的 Codex 面板 |
| `chatgpt.openSidebar` | 打开 Codex 侧边栏 |

常见用法：

1. 在编辑器里选中一段出问题的代码。
2. 执行 `chatgpt.addToThread`。
3. 在 Codex 里提问：`这段代码为什么会导致类型收窄失败？请给出最小修改。`

这样比直接粘贴代码更稳，因为 Codex 可以拿到文件路径、当前选区和编辑器上下文。

## 七、常见工作流示例

### 1. 让 Codex 阅读项目并生成上手说明

```bash
codex --cd ./my-project "阅读项目结构，整理启动、构建、测试和部署方式"
```

进入会话后可以继续：

```text
/mention package.json
/mention README.md
/status
```

### 2. 修复一个 bug

```bash
codex --cd ./my-project -s workspace-write
```

然后在 Codex 里输入：

```text
用户列表页搜索后分页没有重置，请定位原因并修复，最后运行相关测试
```

完成后检查：

```text
/diff
/review
```

### 3. 做一次只读代码审查

```bash
codex --cd ./my-project -s read-only
```

然后输入：

```text
/review
```

如果想审查某几个文件：

```text
/mention src/services/order.ts
/mention src/pages/order/List.vue
请重点检查订单状态流转和异常处理
```

### 4. 非交互生成变更总结

```bash
codex exec --cd ./my-project --output-last-message change-summary.md \
  "根据当前 git diff 生成一份中文变更说明，包含影响范围和测试建议"
```

### 5. 用 JSON 输出给脚本消费

```bash
codex exec --json "扫描当前项目，列出可能缺少测试的模块"
```

如果你希望输出更稳定，可以配合 `--output-schema`：

```bash
codex exec --output-schema schema.json "输出缺少测试的模块清单"
```

### 6. 引入 MCP 工具

```bash
codex mcp list
codex mcp add docs --url http://localhost:3000/mcp
```

进入 Codex 后查看：

```text
/mcp verbose
```

### 7. 写项目级规则

在项目根目录启动 Codex：

```bash
codex
```

然后输入：

```text
/init
```

这会生成 `AGENTS.md` 脚手架。可以把项目约定写进去，例如：

```md
# AGENTS.md

- 修改前先阅读相邻模块的实现风格。
- 前端组件优先使用现有 design system。
- 改动后尽量运行 pnpm lint 和相关测试。
- 不要改动无关文件。
```

之后 Codex 在这个项目里工作时，会优先读取这些规则。

## 八、哪些指令最值得先掌握

如果你刚开始用 Codex，不需要一口气记住所有命令。先掌握下面这些就够用了：

| 优先级 | 指令 | 为什么重要 |
| --- | --- | --- |
| 必会 | `codex` | 启动交互式开发 |
| 必会 | `codex exec` | 做脚本化、一次性任务 |
| 必会 | `/model` | 根据任务切换模型和推理强度 |
| 必会 | `/permissions` | 控制 Codex 能不能改文件、跑命令 |
| 必会 | `/diff` | 检查 Codex 到底改了什么 |
| 必会 | `/review` | 提交前让 Codex 再审一遍 |
| 必会 | `/compact` | 长任务保住关键上下文 |
| 必会 | `/mention` | 精确指定文件 |
| 推荐 | `/status` | 查看当前模型、权限、token |
| 推荐 | `/plan` | 大改动前先出方案 |
| 推荐 | `/goal` | 长任务持续推进 |
| 推荐 | `/mcp` | 检查外部工具接入 |
| 推荐 | `/skills` | 使用任务专用技能 |
| 推荐 | `codex features` | 开启或关闭新能力 |
| 推荐 | `codex mcp` | 管理 MCP 服务器 |

我个人最常用的一组组合是：

```text
/status
/mention
/plan
/diff
/review
/compact
```

对应的工作节奏是：先确认环境，再指定文件，再让 Codex 计划，执行后看 diff，最后做 review。如果任务很长，中途用 `/compact` 压缩上下文。

## 九、使用 Codex 指令的注意事项

### 1. 不要随便使用 `--yolo`

`--yolo` 会跳过审批和沙盒，等于让 Codex 放开手脚执行命令。只有在临时容器、可丢弃目录、CI 隔离环境里才建议使用。

日常更推荐：

```bash
codex -s workspace-write -a on-request
```

### 2. 大改动先 `/plan`

比如迁移框架、重构目录、改构建配置，先让 Codex 出计划：

```text
/plan 请先分析迁移风险，给出分阶段方案，不要直接改代码
```

确认方案后再让它执行。

### 3. 提交前一定看 `/diff`

Codex 改代码通常很快，但你仍然需要检查：

- 有没有改到无关文件
- 有没有生成临时文件
- 有没有删除你手写的逻辑
- 有没有遗漏测试或文档

### 4. 长会话及时 `/compact`

上下文太长后，模型容易忘记早期约束。长任务建议在阶段完成后执行：

```text
/compact
```

让 Codex 把关键决策、已完成事项、未完成事项压缩成摘要。

### 5. 用 `AGENTS.md` 固化项目规则

不要每次都重复说：

- 使用 TypeScript
- 不要改无关文件
- UI 遵循现有组件库
- 改完跑测试
- 新文章放到固定目录

这些都适合写进 `AGENTS.md`。

## 十、小结

Codex 的指令可以理解成三层：

- 第一层是 `codex ...`：负责启动、登录、自动化、配置、MCP 和插件管理。
- 第二层是 `/...`：负责在会话中切换模型、权限、上下文、review、diff、压缩和工具状态。
- 第三层是 IDE / App 命令：负责把 Codex 融入日常编辑器和桌面工作流。

实际使用时，不必追求记住所有命令。先把 `codex`、`codex exec`、`/model`、`/permissions`、`/mention`、`/diff`、`/review`、`/compact`、`/status` 用熟，再逐步加上 `/goal`、`/skills`、`/mcp`、`codex features` 和 `codex mcp`，基本就能覆盖大多数开发场景。

## 参考资料

- [Codex CLI 官方文档](https://developers.openai.com/codex/cli)
- [Codex CLI 命令行参数参考](https://developers.openai.com/codex/cli/reference)
- [Codex CLI 斜杠命令](https://developers.openai.com/codex/cli/slash-commands)
- [Codex App 命令](https://developers.openai.com/codex/app/commands)
- [Codex IDE 扩展命令](https://developers.openai.com/codex/ide/commands)
- [OpenAI Codex GitHub 仓库](https://github.com/openai/codex)
