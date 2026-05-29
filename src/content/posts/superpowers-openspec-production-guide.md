---
title: "Superpowers 与 OpenSpec 应用指南：让 AI Coding Agent 进入生产流程"
description: "详细介绍 Superpowers 和 OpenSpec 的定位、用途、使用方式、解决的问题，以及如何把它们一步步落地到真实团队的需求、开发、测试、评审和发布流程中。"
pubDate: 2026-05-29
category: "技术教程"
tags: ["AI Agent", "Codex", "OpenSpec", "Superpowers", "工程化"]
readTime: "18 分钟"
featured: false
---

# Superpowers 与 OpenSpec 应用指南：让 AI Coding Agent 进入生产流程

AI Coding Agent 已经不只是“帮我写一段代码”的补全工具。以 Codex、Claude Code、Cursor、OpenCode、Windsurf 等为代表的新一代工具，已经可以阅读项目、修改多文件、运行测试、修复 bug、生成 PR，甚至在较长时间内独立推进一个任务。

但真正把 AI Agent 放进生产研发流程时，团队很快会遇到几个问题：

- 需求只存在聊天记录里，过几天就找不到原始意图
- Agent 容易直接写代码，缺少设计、拆解、测试和评审过程
- 不同开发者提示词风格不同，产出质量不稳定
- 大功能上下文太长，Agent 容易偏离目标
- 代码 review 只能看到 diff，很难快速理解“需求到底变了什么”
- 老项目复杂，Agent 如果不了解边界，很容易改出隐性回归

Superpowers 和 OpenSpec 都是在解决这些问题，只是切入点不同：

- **Superpowers**：给 AI Coding Agent 装上一套“工程师工作方法论”，通过 Skills、工作流、TDD、计划、子任务执行和评审，让 Agent 更像一个有纪律的工程师。
- **OpenSpec**：给 AI 辅助开发增加一层轻量规格系统，把需求、设计、任务和规格变更沉淀在代码仓库里，让人和 Agent 在写代码前先对齐“要做什么、为什么做、怎么验收”。

一句话总结：

> Superpowers 管“Agent 怎么做事”，OpenSpec 管“事情应该被如何描述、追踪和沉淀”。

## 一、Superpowers 是什么

Superpowers 是一个开源的 agentic skills framework，也可以理解为一套面向 AI Coding Agent 的软件开发方法论。它不是一个新的 IDE，也不是一个新的大模型，而是把一组可组合的 Skills 和指令安装到现有 Agent 里，让 Agent 在合适的时机自动采用更可靠的开发流程。

官方对它的定位是：一套完整的软件开发方法论，构建在可组合 skills 和初始化指令之上，用来确保 Agent 会使用这些技能。

它支持多个 Agent 环境，包括：

- Claude Code
- Codex CLI
- Codex App
- Cursor
- OpenCode
- Gemini CLI
- Factory Droid
- GitHub Copilot CLI

### Superpowers 的核心思想

普通 AI Agent 的默认行为往往是：

1. 用户提出需求
2. Agent 立刻搜索文件
3. Agent 直接修改代码
4. Agent 简单运行测试
5. Agent 宣布完成

这个流程适合小修小补，但对复杂需求会有风险。Superpowers 会把过程改造成更工程化的节奏：

1. 先澄清目标和约束
2. 形成可阅读的设计说明
3. 让用户确认设计
4. 拆成小任务
5. 用 TDD 或可验证方式实现
6. 每个阶段做代码审查
7. 完成后整理分支、测试和合并建议

它强调几个原则：

- **Design before code**：先设计，再写代码
- **TDD first**：尽量先写失败测试，再写实现
- **Systematic over ad-hoc**：用系统化方法替代临时猜测
- **Evidence over claims**：用测试、日志、diff 和复现结果证明完成
- **YAGNI / DRY**：避免过度设计和重复实现

### Superpowers 里面有什么

Superpowers 的能力主要通过 Skills 组织。常见技能包括：

| 技能 | 作用 | 适合场景 |
| --- | --- | --- |
| `brainstorming` | 在写代码前通过提问澄清需求 | 需求模糊、业务边界不清 |
| `writing-plans` | 把设计拆成可执行计划 | 多文件改动、大功能、重构 |
| `executing-plans` | 按计划分批执行 | 需要人类阶段性确认 |
| `subagent-driven-development` | 用子 Agent 执行任务并做两阶段评审 | 大任务、并行任务 |
| `test-driven-development` | 强制 RED-GREEN-REFACTOR | 核心逻辑、稳定性要求高 |
| `requesting-code-review` | 在任务间做代码审查 | 防止实现偏离计划 |
| `systematic-debugging` | 系统化排查根因 | 难复现 bug、异步问题 |
| `verification-before-completion` | 完成前验证结果 | 防止“看起来完成” |
| `using-git-worktrees` | 用独立 worktree 开发 | 多任务并行、隔离实验 |
| `finishing-a-development-branch` | 收尾分支、测试、合并或丢弃 | 开发完成后的整理 |

这些 Skills 的价值不在于某个单点能力，而在于把 Agent 的行为从“随手写代码”约束成“按工程流程推进”。

## 二、Superpowers 能解决什么问题

### 1. 解决 AI Agent 过早写代码的问题

很多 Agent 很聪明，但也很积极。你说“帮我做一个权限控制”，它可能马上开始加字段、改接口、写组件。

问题是：权限控制到底是 RBAC、ABAC，还是简单按钮权限？是否影响菜单、路由、接口、审计日志？是否需要兼容老数据？这些问题没澄清前直接改代码，很容易做偏。

Superpowers 会促使 Agent 先进入 brainstorming 和 design 阶段，把问题问清楚再动手。

### 2. 解决上下文漂移的问题

长任务中，Agent 可能忘记最初目标，或者越改越远。Superpowers 通过设计文档、计划、任务清单和阶段性 review，把任务锚定在明确目标上。

### 3. 解决测试被忽略的问题

AI 写代码时很容易“实现优先，测试补一点”。Superpowers 强调 TDD，尤其适合：

- 核心工具函数
- 复杂业务规则
- 权限判断
- 支付、订单、结算
- 数据迁移
- 状态机和流程引擎

在这些场景里，先写失败测试能逼迫 Agent 明确验收标准。

### 4. 解决 Agent 产出不可复用的问题

如果每次开发都靠临时提示词，团队很难沉淀经验。Superpowers 把好的工作方式抽象成 Skills，让团队成员和不同 Agent 都能复用同一套方法。

### 5. 解决 review 不充分的问题

Superpowers 的流程中会穿插代码审查，尤其是：

- 是否符合计划
- 是否满足规格
- 是否引入回归
- 是否有过度设计
- 是否有漏测
- 是否有安全和边界问题

这比最后一次性看大 diff 更稳。

## 三、Superpowers 怎么使用

不同 Agent 的安装方式不同。以 Codex 为例，官方推荐通过插件市场安装。

### Codex CLI 中安装

进入 Codex CLI 后输入：

```text
/plugins
```

搜索：

```text
superpowers
```

然后选择安装插件。

安装后，Superpowers 的 Skills 会在合适的任务中自动触发。你也可以在 Codex App 里通过侧边栏的 Plugins 页面安装。

### Claude Code 中安装

Claude Code 可以通过官方插件市场安装：

```text
/plugin install superpowers@claude-plugins-official
```

也可以先添加 Superpowers marketplace，再安装：

```text
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

### 日常使用示例

安装后，你不一定需要记住复杂命令。更自然的方式是直接提出任务：

```text
我想给后台系统增加基于角色的按钮权限，请先不要写代码，先帮我澄清需求并给出设计方案。
```

Superpowers 理想的响应应该是先询问关键问题，例如：

- 权限粒度是页面、菜单、按钮还是接口？
- 当前是否已有用户、角色、菜单表？
- 权限变更是否需要实时生效？
- 前端隐藏按钮是否还需要后端接口校验？
- 老数据如何兼容？

设计确认后，再让它继续：

```text
按这个设计写实施计划，拆成小任务，每个任务要包含涉及文件、验证方式和风险点。
```

最后执行：

```text
按计划分阶段实现。每完成一个阶段先停下来展示 diff、测试结果和下一步建议。
```

## 四、OpenSpec 是什么

OpenSpec 是一个面向 AI Coding Assistant 的轻量级 Spec-Driven Development，也就是规格驱动开发框架。

它的目标不是替代代码，也不是引入厚重流程，而是在仓库里增加一层可版本化、可 review、可被 Agent 读取的规格文档。这样人和 AI 在写代码前先对齐需求，写代码后也能追踪规格如何变化。

OpenSpec 的核心目录通常类似：

```text
openspec/
├── specs/
│   ├── auth-session/
│   │   └── spec.md
│   ├── checkout-cart/
│   │   └── spec.md
│   └── checkout-payment/
│       └── spec.md
└── changes/
    └── add-remember-me/
        ├── proposal.md
        ├── design.md
        ├── tasks.md
        └── specs/
            └── auth-session/
                └── spec.md
```

其中：

- `specs/`：当前系统已经生效的能力规格
- `changes/`：正在进行或待 review 的变更
- `proposal.md`：为什么要做、做什么、不做什么
- `design.md`：技术设计、方案取舍、影响范围
- `tasks.md`：可执行任务清单
- `changes/.../specs/`：这次需求对现有规格的增量变更

### OpenSpec 的核心思想

OpenSpec 解决的是“需求和上下文不能只存在聊天里”的问题。

普通 AI 辅助开发中，需求通常是这样流动的：

```text
产品想法 -> 聊天提示词 -> Agent 写代码 -> Git diff -> PR
```

这中间缺少一个稳定的规格层。过几天后，团队只能从代码和聊天记录里倒推“当时为什么这么做”。

OpenSpec 会把流程变成：

```text
产品想法 -> proposal/design/tasks/spec delta -> Agent 写代码 -> 测试 -> archive 到 specs
```

这样每个功能都有明确的意图、设计、任务和验收标准。

## 五、OpenSpec 能解决什么问题

### 1. 解决“需求只在聊天记录里”的问题

聊天记录是临时上下文，不适合长期维护。OpenSpec 把需求写进仓库，跟代码一起版本管理。

当新成员加入项目时，他不只看代码，还可以看规格：

```md
### Requirement: Session expiration

The system SHALL expire sessions after a configured duration.

#### Scenario: Default session timeout

- GIVEN a user has authenticated
- WHEN 24 hours pass without activity
- THEN invalidate the session token
- AND require re-authentication
```

这种格式对人类和 AI 都友好。

### 2. 解决“review 只能看代码”的问题

代码 diff 告诉你“改了什么文件”，但很难告诉你“业务能力变成了什么”。

OpenSpec 的 spec delta 可以让 reviewer 先看需求变化：

- 新增了哪些行为？
- 删除了哪些约束？
- 修改了哪些验收场景？
- 有没有遗漏边界条件？

确认意图后，再看代码实现会高效很多。

### 3. 解决复杂需求拆不清的问题

OpenSpec 会要求一次 change 包含 proposal、design、tasks 和 spec delta。这个结构天然促使团队拆清楚：

- 做什么
- 为什么做
- 不做什么
- 影响哪些能力
- 有哪些验收场景
- 分几步落地

### 4. 解决跨 Agent、跨会话上下文不一致的问题

今天你用 Codex，明天同事用 Cursor，后天换 Claude Code。如果需求只在某个 Agent 的聊天里，就很难迁移。

OpenSpec 把上下文放在仓库里，让不同 Agent 都能读取同一份规格。它支持 20 多种 AI coding 工具，适合团队在不同工具间保持统一工作流。

### 5. 解决老项目 AI 改造风险高的问题

OpenSpec 是 brownfield-first 思路，也就是更适合已有项目逐步引入。它不要求你先为整个老系统补全所有规格，而是建议从新需求、新改动开始沉淀。

## 六、OpenSpec 怎么使用

OpenSpec 是一个 npm 包，要求 Node.js 20.19.0 或更高版本。

安装：

```bash
npm install -g @fission-ai/openspec@latest
```

进入项目并初始化：

```bash
cd your-project
openspec init
```

初始化后，让 AI 创建一个 proposal：

```text
/opsx:propose 添加 remember me 复选框，登录后可保持 30 天会话
```

OpenSpec 会引导 Agent 读取现有规格和代码，然后生成类似结构：

```text
openspec/changes/add-remember-me/
├── proposal.md
├── design.md
├── tasks.md
└── specs/
    └── auth-session/
        └── spec.md
```

如果选择扩展工作流，还可以使用：

```text
/opsx:new
/opsx:continue
/opsx:ff
/opsx:verify
/opsx:archive
/opsx:onboard
```

不同工具里命令名称可能略有差异，以 `openspec init` 生成的本地说明和当前工具支持为准。

### 一个典型 OpenSpec 变更流程

假设要做“后台用户支持多角色”。

第一步，生成提案：

```text
/opsx:propose 后台用户支持绑定多个角色，权限取多个角色权限并集
```

第二步，检查 `proposal.md`：

```md
# Change: support-multiple-roles

## Why

当前后台用户只能绑定一个角色，无法覆盖运营、审核、财务等复合职责场景。

## What Changes

- 用户可以绑定多个角色
- 权限计算从单角色变为多角色并集
- 用户管理页面支持多选角色
- 保持老用户单角色数据兼容

## Out of Scope

- 不做部门权限
- 不做数据权限
- 不重构现有菜单系统
```

第三步，检查 `design.md`：

```md
## Design

- 数据层新增 user_roles 关系表
- 登录后返回权限集合
- 前端按钮权限仍使用 hasPermission(code)
- 老字段 role_id 暂时保留，只作为迁移兼容

## Risks

- 权限缓存需要失效
- 老接口可能仍依赖 role_id
- 角色删除时需要处理关联关系
```

第四步，检查 `tasks.md`：

```md
## Tasks

- [ ] 1. 新增 user_roles 表和迁移脚本
- [ ] 2. 改造用户角色查询逻辑
- [ ] 3. 改造权限计算为角色并集
- [ ] 4. 改造用户管理页面角色选择
- [ ] 5. 补充权限计算单元测试
- [ ] 6. 补充回归测试和迁移说明
```

第五步，检查 spec delta：

```md
### Requirement: User role assignment

The system SHALL allow an admin user to assign multiple roles to a backend user.

#### Scenario: Permissions are merged from multiple roles

- GIVEN a backend user has role A and role B
- WHEN the system calculates user permissions
- THEN the final permission set includes permissions from both role A and role B
```

第六步，确认后实现：

```text
/opsx:continue
```

第七步，完成后归档：

```text
/opsx:archive
```

归档后，这次变更的规格会进入 `openspec/specs/`，成为系统长期文档的一部分。

## 七、Superpowers 和 OpenSpec 的区别

| 维度 | Superpowers | OpenSpec |
| --- | --- | --- |
| 核心定位 | Agent 工作方法论和技能系统 | 轻量规格驱动开发框架 |
| 关注重点 | Agent 如何计划、实现、测试、评审 | 需求、设计、任务、规格如何沉淀 |
| 主要产物 | Skills、计划、review、测试过程 | `openspec/` 目录下的规格文档 |
| 是否改变仓库结构 | 通常较少 | 会新增 `openspec/` 目录 |
| 适合问题 | Agent 太随意、缺少 TDD 和流程 | 需求难追踪、上下文难共享 |
| 团队协作价值 | 统一 Agent 做事方式 | 统一需求和规格表达方式 |
| 和具体 Agent 绑定 | 依赖不同 Agent 插件机制 | 更偏工具无关，支持多种 Agent |
| 生产落地点 | 开发执行过程 | 需求到代码的可审计链路 |

更直观地说：

- Superpowers 像是给 Agent 配了一位“技术教练”
- OpenSpec 像是给项目增加了一套“轻量需求和设计档案”

## 八、两者是否可以一起用

可以，而且它们的组合非常自然。

推荐组合方式：

1. 用 OpenSpec 管需求、设计、任务和验收标准
2. 用 Superpowers 管 Agent 的执行纪律、TDD、review 和收尾

组合后的流程可以是：

```text
需求想法
  ↓
OpenSpec: proposal / design / tasks / spec delta
  ↓
人类 review 规格
  ↓
Superpowers: 按计划执行、TDD、阶段性 review
  ↓
测试和代码 review
  ↓
OpenSpec: archive，更新长期 specs
  ↓
发布和复盘
```

这种组合特别适合：

- 中大型前端项目
- 后台管理系统
- 多人协作项目
- 有权限、订单、支付、审核流等复杂业务规则的系统
- 需要较强可追溯性的企业项目
- 想把 AI Agent 纳入正式研发流程的团队

## 九、如何一步步落地到生产过程

下面是一套比较稳的落地路线。不要一开始就全量改造所有流程，建议从一个小团队、一个项目、一个功能类型开始。

### 第 0 阶段：明确边界

先约定哪些任务允许 AI Agent 参与，哪些暂时不允许。

建议先允许：

- 文档整理
- 单元测试补充
- 小型 bug 修复
- 工具函数重构
- 非核心页面改造
- 新增后台管理页面

暂时谨慎：

- 支付链路
- 权限核心逻辑
- 数据迁移
- 安全敏感模块
- 大规模架构重构
- 线上事故修复

这一阶段的目标不是追求效率最大化，而是建立安全边界。

### 第 1 阶段：引入 OpenSpec，先让需求可追踪

在项目里执行：

```bash
npm install -g @fission-ai/openspec@latest
openspec init
```

然后选择一个中等复杂度需求试点，例如：

- 用户管理增加批量导入
- 内容审核增加撤回能力
- 订单列表增加高级筛选
- 管理后台增加按钮权限

要求每个 AI 参与的需求都先生成：

- `proposal.md`
- `design.md`
- `tasks.md`
- spec delta

团队 review 这几份文档，而不是直接 review AI 生成的大量代码。

### 第 2 阶段：建立规格 review 规则

OpenSpec 能不能产生价值，关键在于团队是否认真 review 规格。

建议制定一个 checklist：

```md
## OpenSpec Review Checklist

- 需求背景是否清楚？
- 是否写明不做什么？
- 是否列出影响范围？
- 是否包含异常场景？
- 是否包含兼容老数据或老接口的方案？
- 是否有可验证的验收标准？
- tasks 是否足够小？
- 是否有测试任务？
- 是否有回滚或灰度策略？
```

如果 proposal 都讲不清楚，就不要让 Agent 开始写代码。

### 第 3 阶段：引入 Superpowers，规范 Agent 执行过程

在 Codex、Claude Code 或团队主力工具里安装 Superpowers。

然后要求 Agent 遵循：

```text
请按 Superpowers 的方式推进：
1. 先阅读 OpenSpec change
2. 确认设计和任务
3. 每次只执行一个小任务
4. 涉及核心逻辑时先写测试
5. 每个阶段完成后展示 diff 和验证结果
6. 不要改动无关文件
```

这一步的重点是把 Agent 从“自由发挥”变成“按规格执行”。

### 第 4 阶段：把测试作为 AI 任务的准入条件

生产落地时，最容易出问题的是“AI 改完代码但没人知道有没有回归”。

建议给不同任务定义测试要求：

| 任务类型 | 最低验证要求 |
| --- | --- |
| 文档修改 | 构建或文档 lint 通过 |
| UI 小改动 | 页面可打开，截图或手工验收 |
| 工具函数 | 单元测试覆盖正常和异常输入 |
| 接口逻辑 | 单元测试或集成测试 |
| 权限逻辑 | 权限矩阵测试 |
| 数据迁移 | 本地迁移、回滚、空数据和老数据测试 |
| 性能优化 | 优化前后指标对比 |

让 Superpowers 的 TDD 和 verification 技能配合这个规则执行。

### 第 5 阶段：接入 Git 分支和 PR 流程

推荐每个 OpenSpec change 对应一个分支：

```text
feature/openspec-add-remember-me
fix/openspec-order-status-filter
refactor/openspec-permission-model
```

PR 描述里带上：

```md
## OpenSpec Change

openspec/changes/add-remember-me

## What changed

- 支持 remember me 登录
- 会话有效期从固定 24 小时扩展为可配置
- 新增 30 天持久会话场景

## Verification

- pnpm test
- pnpm build
- 手工验证登录、退出、过期场景
```

这样 reviewer 可以先看 OpenSpec，再看代码 diff。

### 第 6 阶段：把规格归档成长期文档

功能完成并合并后，执行：

```text
/opsx:archive
```

归档后，规格会进入 `openspec/specs/`，成为长期文档。

这一步很关键。否则 OpenSpec 只会变成“开发前临时文档”，没有形成系统知识库。

### 第 7 阶段：沉淀团队自己的模板

当团队跑通 3 到 5 个需求后，就可以沉淀模板。

例如后台系统模板：

```md
## Proposal 必填项

- 背景
- 用户角色
- 业务流程
- 权限变化
- 数据变化
- 不做事项
- 灰度和回滚

## Design 必填项

- 前端影响
- 后端影响
- 数据库影响
- 缓存影响
- 埋点影响
- 兼容性
- 风险

## Tasks 必填项

- 数据层
- 接口层
- 前端页面
- 测试
- 文档
- 验收
```

也可以进一步写成团队自己的 Superpowers Skill 或 Codex Skill。

### 第 8 阶段：接入 CI 和质量门禁

生产流程里，AI 生成代码不能绕开质量门禁。

建议 PR 必须通过：

- TypeScript 类型检查
- ESLint / Biome
- 单元测试
- 构建
- 关键路径 e2e
- 安全扫描
- OpenSpec change 是否存在
- OpenSpec tasks 是否完成

可以在 CI 中加入简单检查：

```bash
test -d openspec/changes || echo "No OpenSpec changes found"
pnpm lint
pnpm test
pnpm build
```

更成熟后，可以要求 PR 必须关联某个 OpenSpec change。

### 第 9 阶段：定义人机协作职责

不要让 AI Agent 变成“无人监督的合并机器”。生产环境里建议这样分工：

| 环节 | 人类负责 | AI Agent 负责 |
| --- | --- | --- |
| 需求判断 | 业务价值、优先级、边界 | 辅助澄清问题 |
| 方案设计 | 架构取舍、风险确认 | 生成备选方案 |
| 任务拆解 | 确认粒度和顺序 | 生成 tasks |
| 编码实现 | 审核关键代码 | 执行小任务 |
| 测试验证 | 定义验收标准 | 编写和运行测试 |
| Review | 最终质量责任 | 自查、解释 diff |
| 发布 | 灰度、监控、回滚 | 生成发布说明 |

原则是：AI 可以加速执行，但人类必须保留产品判断、架构判断和上线责任。

## 十、落地案例：后台按钮权限改造

假设团队要做“后台按钮权限”。

### 不使用 Superpowers / OpenSpec 的做法

```text
帮我给后台加按钮权限，按钮根据用户权限显示隐藏。
```

Agent 可能会直接：

- 加一个 `hasPermission`
- 改几个页面按钮
- 在前端隐藏按钮
- 简单补一点测试或不补测试

风险是：

- 后端接口是否校验不清楚
- 权限码从哪里来不清楚
- 菜单权限和按钮权限关系不清楚
- 超级管理员怎么处理不清楚
- 老页面如何迁移不清楚

### 使用 OpenSpec 的做法

先创建 proposal：

```text
/opsx:propose 后台系统增加按钮级权限控制，支持菜单权限和按钮权限分离
```

要求 OpenSpec 明确：

- 权限码命名规则
- 菜单权限和按钮权限的关系
- 前端隐藏和后端校验边界
- 超级管理员逻辑
- 老页面迁移策略
- 验收场景

### 使用 Superpowers 执行

确认规格后，让 Agent：

```text
请读取 openspec/changes/button-permission，按 tasks 分阶段实现。
核心权限判断先写测试，每完成一个阶段展示 diff 和验证结果。
```

执行顺序可以是：

1. 建立权限码类型和 `hasPermission`
2. 补权限计算测试
3. 改造用户权限接口
4. 改造前端权限指令或组件
5. 迁移 2 个试点页面
6. 补文档和迁移指南
7. 做 review 和 build

最终 PR 中 reviewer 看到的不只是代码，还有：

- 为什么要做按钮权限
- 权限边界是什么
- 哪些场景被覆盖
- 哪些页面已迁移
- 哪些页面暂不迁移
- 测试如何证明没有回归

这就是从“AI 写代码”升级到“AI 参与工程流程”。

## 十一、常见风险和规避方式

### 1. 文档写得太重，开发者不愿意用

OpenSpec 不是让团队写长篇 PRD。建议每个 change 的文档保持轻量：

- proposal 控制在 1 到 2 屏
- design 只写关键取舍
- tasks 只拆可执行任务
- spec 只写重要行为和验收场景

### 2. Agent 机械执行，忽略真实项目约束

Superpowers 能规范流程，但不能替代项目理解。每次执行前仍应要求 Agent：

```text
先阅读现有实现和项目约定，不要假设不存在的 API，不要发明新的架构风格。
```

### 3. 规格和代码不同步

如果功能做完不归档，或者代码变了规格没变，OpenSpec 会失去可信度。

建议把 `/opsx:archive` 或规格更新作为 PR checklist 的一项。

### 4. 测试只跑 happy path

AI 很容易补“看起来有测试”的用例。核心逻辑要明确要求：

- 正常路径
- 异常路径
- 边界值
- 权限不足
- 老数据兼容
- 并发或重复提交

### 5. 对 AI 过度信任

Superpowers 和 OpenSpec 提升的是“可控性”，不是让 AI 自动承担责任。生产环境仍然需要：

- 人类 review
- CI 门禁
- 灰度发布
- 监控告警
- 回滚预案

## 十二、选型建议

### 只选 Superpowers 的场景

适合：

- 团队已经有成熟需求文档体系
- 主要问题是 Agent 执行太随意
- 想强化 TDD、review、debug 和任务拆解
- 不想改仓库结构

### 只选 OpenSpec 的场景

适合：

- 团队最痛的是需求不可追踪
- 多人多 Agent 协作
- PR review 需要先看意图
- 老项目想逐步沉淀业务规格

### 两者都用的场景

适合：

- 复杂业务系统
- 中大型团队
- 想把 AI Agent 纳入正式研发流程
- 对质量、审计、可追溯性有要求
- 希望从需求到发布都有结构化记录

我的建议是：

1. 个人项目：先用 OpenSpec，避免需求丢失；再按需加 Superpowers。
2. 小团队：OpenSpec 作为需求和 review 入口，Superpowers 作为实现纪律。
3. 企业项目：两者结合，并接入 CI、PR 模板、测试门禁和发布流程。

## 十三、推荐落地模板

可以从下面这套最小流程开始：

```text
1. 需求进入
   - 用 OpenSpec 创建 proposal
   - 明确 why / what / out of scope

2. 技术设计
   - 生成 design
   - 人类 review 风险和边界

3. 任务拆解
   - 生成 tasks
   - 每个任务控制在可 review 的小范围

4. Agent 实现
   - Superpowers 按任务执行
   - 核心逻辑先测试
   - 每阶段展示 diff 和验证结果

5. 代码审查
   - 先 review spec delta
   - 再 review code diff
   - 最后 review 测试结果

6. 合并发布
   - CI 全通过
   - 归档 OpenSpec
   - 更新发布说明和回滚方案
```

配套 PR checklist：

```md
## AI Assisted Development Checklist

- [ ] 已关联 OpenSpec change
- [ ] proposal 已 review
- [ ] design 已确认风险和边界
- [ ] tasks 已完成
- [ ] spec delta 已 review
- [ ] 核心逻辑有测试
- [ ] 已运行 lint / test / build
- [ ] 已说明灰度、回滚或兼容策略
- [ ] OpenSpec 已归档或说明暂不归档原因
```

## 十四、小结

Superpowers 和 OpenSpec 不是两个互相替代的工具，而是 AI 辅助研发流程里的两个不同层次：

- **OpenSpec 让需求和设计可见、可审查、可版本化。**
- **Superpowers 让 Agent 的执行过程更有纪律、更可验证、更接近真实工程实践。**

如果只是让 AI 帮忙写几段代码，它们可能显得有点“重”。但当团队开始让 AI 参与复杂需求、多人协作、核心模块改造和生产发布时，这种结构化流程会变得非常有价值。

真正可持续的 AI Coding 不是“让 Agent 写得更快”，而是让 Agent 在正确的上下文、明确的规格、可验证的任务和人类可控的流程里写代码。

## 参考资料

- [Superpowers GitHub 仓库](https://github.com/obra/superpowers)
- [OpenSpec 官方网站](https://openspec.dev/)
- [OpenSpec GitHub 仓库](https://github.com/Fission-AI/OpenSpec)
- [OpenSpec Pro 文档与指南](https://openspec.pro/)
- [Thoughtworks Technology Radar: OpenSpec](https://www.thoughtworks.com/radar/tools/openspec)
