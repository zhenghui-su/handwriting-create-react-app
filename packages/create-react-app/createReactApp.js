const { Command } = require('commander');
const packageJSON = require('./package.json');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

async function init() {
    let projectName;
    new Command(packageJSON.name) // 项目名
        .version(packageJSON.version) // 版本号
        .arguments('<project-directory>') // 项目的目录名
        .usage(`${chalk.green('<project-directory>')} [options]`)
        .action(name => {
            projectName = name;
        })
        .parse(process.argv); // [node完整路径,当前node脚本的路径,...其它参数]
    console.log('projectName', projectName);
    await createApp(projectName);
}

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
    console.log('appName', appName);
    console.log('root', root);
    console.log('originalDirectory', originalDirectory);
}

module.exports = {
    init
}