## 从零手写 create-react-app

前置知识：

+ yarn包管理
+ workspace工作区知识概念
+ Monorepo知识概念

### 初始化

一些知识科普讲解

+ Lerna 是一个用于管理具有多个包（packages）的 JavaScript 项目的工具。在一个大型 JavaScript 项目中，通常会有多个独立的模块或包，这些包可能相互依赖，或者需要一起发布。

+ 工作区（Workspace）通常是指在一个项目中，可以同时处理多个相关联的子项目（packages，modules等），而不需要将它们分别作为独立的项目来处理。在软件开发领域，工作区通常是指一个包含了多个子项目的项目容器，这些子项目可以共享一些配置、依赖关系和构建流程。
+ Monorepo是 "单一代码仓库"（Monorepository）的缩写，它是一种软件开发的组织结构模式，其中所有项目或者库的代码都放在一个单一的版本控制仓库中。通常，这种仓库包含了多个相关的项目、库或者组件，这些项目可能共享某些代码、依赖关系或者配置。

全局安装 lerna

```bash
npm i lerna@3.22.1 -g
```

输入如下检测是否安装成功

```bash
lerna -v
```

在要创建的文件夹，打开终端，输入如下初始化

```bash
lerna init
```

打开后，这里我用 **yarn**管理，终端输入

```bash
yarn install
```

两个作用：安装lerna和它的依赖，在根目录的node_modules里面创建软链接，链向各个packages中的各个包

> yarn 支持workspace 	npm只有在7版本以上支持
>
> yarn workspace    VS     lerna
>
> yarn重点在于包管理、处理依赖和软链
>
> lerna重点在于多个项目管理和发布

然后创建 packages 文件夹（workspace），最终形成的初始文件目录如下

![image-20231004232629874](https://gitee.com/dont-sleep-in-the-morning/pictures/raw/master/image-20231004232629874.png)

### 创建 package

##### 创建 create-react-app

在终端输入,然后在协议(license)改为 MIT，入口(main)改为`index.js`其它不变

```bash
lerna create create-react-app
```

然后进入，把一些无用的删除，最终形成如下

![image-20231004233303465](https://gitee.com/dont-sleep-in-the-morning/pictures/raw/master/image-20231004233303465.png)

##### 创建react-scripts

终端输入

```bash
lerna create react-scripts
```

##### 创建cra-template

终端输入

```bash
lerna create cra-template
```

##### 查看工作包

终端输入

```bash
yarn workspaces info
```

![image-20231004234845726](https://gitee.com/dont-sleep-in-the-morning/pictures/raw/master/image-20231004234845726.png)

最终形成的结构图如下

![image-20231004234956700](https://gitee.com/dont-sleep-in-the-morning/pictures/raw/master/image-20231004234956700.png)

### 添加依赖

在添加之前记得要设置为淘宝源，不然可能会安装很慢

安装如下依赖

```bash
yarn add chalk cross-spawn fs-extra --ignore-workspace-root-check
```

> - **chalk:** `chalk` 是一个用于在终端中添加颜色和样式的库。它允许你在命令行界面中使用不同的颜色和样式来输出文本，使得输出更加清晰和易读。
> - **cross-spawn:** `cross-spawn` 是一个用于跨平台（Windows、Linux、Mac 等）运行子进程的库。它解决了在不同操作系统下创建子进程的差异性，使得在 Node.js 环境中能够一致地运行子进程。
> - **fs-extra:** `fs-extra` 是 Node.js 的文件系统模块（`fs` 模块）的扩展，提供了更多的功能和便捷的方法，使得文件和目录的操作更加容易和灵活。
> - **--ignore-workspace-root-check**:这是 `yarn add` 命令的一个选项。当你在一个使用 Yarn 工作区（Workspace）的项目中执行 `yarn add` 命令时，默认情况下 Yarn 会检查你是否在工作区的根目录（root）中运行该命令。如果你使用了 `--ignore-workspace-root-check` 选项，Yarn 将忽略这个检查，允许你在工作区的任意位置执行 `yarn add` 命令。

在lerna里面，packages里面的各个会在node_modules里面形成符号链接即软链，这样可以在别的package中访问另一个package

![image-20231004235537950](https://gitee.com/dont-sleep-in-the-morning/pictures/raw/master/image-20231004235537950.png)



然后可以根据工作空间安装如下依赖

```bash
yarn workspace create-react-app add commander
```

> `commander` 是一个用于构建命令行界面（CLI）的 Node.js 框架。它可以帮助开发者轻松地构建复杂和易用的命令行工具，提供了处理命令行参数、解析用户输入、显示帮助信息等功能

### 书写代码

在根目录package.json添加脚本命令

```json
"scripts": {
    "create-react-app": "node ./packages/create-react-app/index.js"
}
```

在packages中的create-react-app的index.js文件更改

```js
const { init } = require('./createReactApp');

init();
```

在create-react-app新建`createReactApp.js`文件

> 由于接下来我们需要用到刚刚安装的依赖，我们可以快速学习一下

```js
const chalk = require('chalk');
const {Command} = require('commander');
let program = new Command('create-react-app');
program
    .version('1.0.0') // 设置版本号
	.arguments('<must1> <must2> [option1] [option2]')//设置命令行的参数格式 <>表示必选 []表示可选
	.usage(`${chalk.green(`<must1> <must2> [option1] [option2]`)}`) // 设置用法说明，改颜色
    .action((must1,must2,option1,option2)=>{ // 指令命令的行为
    
	})
```

然后我们开始写`createReactApp.js`文件

```js
const { Command } = require('commander');
const packageJSON = require('./package.json');
const chalk = require('chalk');

function init() {
    let projectName;
    new Command(packageJSON.name) // 项目名
        .version(packageJSON.version) // 版本号
        .arguments('<project-directory>') // 项目的目录名
        .usage(`${chalk.green('<project-directory>')} [options]`)
        .action(name => {
            projectName = name;
        })
        .parse(process.argv); // [node完整路径,当前node脚本的路径,...其它参数]
    console.log('projectName',projectName);
}

module.exports = {
    init
}
```

如果报错等，可以修改`package.json`文件的chalk，高版本可能有错

```json
"dependencies": {
    "chalk": "^4.1.2",
  }
```

在终端运行如下测试是否成功

> -- 后面代码传参

```bash
npm run create-react-app -- myApp
```

此处我们传入项目名，最终终端会输出 myApp

```bash
projectName myApp
```

然后在`createReactApp.js`中创建createApp函数，在init中添加，并修改init为async

```js
async function init() {
    ... // 上面代码搬运下来
    createApp(projectName)
}
```



```js
async function createApp(appName) { // projectName = appName
    let root = path.resolve(appName); // 得到将生成项目绝对路径
    fs.ensureDirSync(appName);// 保证此目录是存在的，如果不存在则创建
    console.log(`Creating a new React app in ${chalk.green(root)}.`);
    const packageJSON = {
        name: appName,
        version: '0.1.0',
        private: true
    }
    // 写入
    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJSON, null, 2)
    );
    const originalDirectory = process.cwd(); // 原始的命令工作目录
    process.chdir(root); // change directory 改变工作目录
    console.log('appName',appName);
    console.log('root',root);
    console.log('originalDirectory', originalDirectory); 
}
```

在终端执行,就会生成一个文件夹myApp并有一个package.json文件了

```bash
npm run create-react-app -- myApp
```

![image-20231005013532488](https://gitee.com/dont-sleep-in-the-morning/pictures/raw/master/image-20231005013532488.png)

> 扩展 JSON.stringify
>
> 如下代码
>
> ```js
> let obj = {name:'chenchen',age:20};
> let result = JSON.stringify(obj,replacer,2); // replacer 替换器 2 为缩进空格
> function replacer(key,value){
>     console.log(key,value);
>     if(key == 'age') return value*2;
>     return value;
> }
> console.log(result);
> ```
>
> 打印结果如下
>
> ```bash
> {name:'chenchen',age:20} //原始的obj
> name chenchen // replacer的console.log(key,value);
> age 10 // replacer的console.log(key,value);
> {
> 	"name":"chenchen", //前面的缩进就是上面定义的2空格
> 	"age":20
> } // 替换后结果
> ```
