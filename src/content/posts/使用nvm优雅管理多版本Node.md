---
title: "使用nvm优雅管理多版本Node"
description: "使用 nvm 工具优雅管理多版本 Node.js，包括安装、切换版本和设置默认版本"
pubDate: 2020-04-08
category: "技术教程"
tags: ["Node.js", "NVM", "开发工具", "版本管理"]
readTime: "5 分钟"
featured: false
---

# 使用nvm优雅管理多版本Node

在开发中，有时候对node的版本有要求，需要切换到指定的node版本来重现问题等。遇到这种需求的时候，我们需要能够灵活的切换node版本。
这里我们使用`nvm`工具来管理多版本node。

`nvm`的具体安装方法这里暂时不展开来说啦，贴上 [传送门](https://github.com/creationix/nvm/blob/master/README.md "传送门") 。
安装成功后，我们便可以开始使用nvm相关指令。

# 安装新的node版本

然后我们尝试更换一个lts版本的node。lts版本是会长期支持的版本，一般在生产环境使用的时候选择lts版本的node。也可以去掉lts参数，查看更多的版本。
`nvm ls-remote --lts`
{% asset\_img [WX20200430-142837@2x.png](mailto:WX20200430-142837@2x.png "WX20200430-142837@2x.png") 查看node的以往的lts版本 %}
找到你所需要安装的node版本，输入以下指令：
`nvm install v10.20.1`
等待一会儿安装成功后。执行`node -v`查看版本号已经是v10.20.1了。

# 切换node版本

通过`nvm ls`命令可以查看已经安装的版本。
{% asset\_img [WX20200430-110307@2x.png](mailto:WX20200430-110307@2x.png "WX20200430-110307@2x.png") 查看node的以往的lts版本 %}

前三行是已经安装的版本，左侧绿色箭头指向的就是当前使用的版本。system为目前系统安装的版本，下面的内容是nvm的内置的几个固定的别名（alias）。

- default nvm 默认使用的版本
- node和stable 当前安装的node的最新的稳定版本
- iojs iojs的最新稳定版本
- lts/\* node lts 系列最新的稳定版本
- lts/argon, lts/boron, lts/carbon, lts/dubnium, lst/erbium 分别指lts的几个大版本的最新版本

大家可以自行安装一下最新的lts/dubnium版本，然后再查看`nvm ls`的结果。
`nvm install lts/dubnium`

我们可以用别名来切换版本，也可以使用版本号来切换。
`nvm use lts/dubnium`

不过这种方式切换node版本只能临时切换，当你开启新的terminal窗口的时候就失效了。如果要彻底的切换过来需要这么操作：
`nvm alias default xxxx`
