## 从零手写create-react-app

### 初始化

Lerna是一个用于管理具有多个包（packages）的JavaScript项目的工具。在一个大型JavaScript项目中，通常会有多个独立的模块或包，这些包可能相互依赖，或者需要一起发布。

全局安装lerna，这是一个多个包的包管理工具

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

打开后，这里我用yarn管理，终端输入

```bash
yarn install
```

然后创建packages文件夹，最终形成的初始文件目录如下

![image-20231004232629874](C:/Users/su/AppData/Roaming/Typora/typora-user-images/image-20231004232629874.png)

### 创建package

##### 创建create-react-app

在终端输入,然后在协议(license)改为MIT，入口(main)改为`index.js`其它不变

```bash
lerna create create-react-app
```

然后进入，把一些无用的删除，最终形成如下

![image-20231004233303465](C:/Users/su/AppData/Roaming/Typora/typora-user-images/image-20231004233303465.png)