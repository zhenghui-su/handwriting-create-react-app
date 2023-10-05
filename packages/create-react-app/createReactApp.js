const { Command } = require('commander');
const packageJSON = require('./package.json');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const spawn = require('cross-spawn');

// 初始化函数
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

// 创建项目函数
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
    await run(root, appName, originalDirectory);
}
/**
 * 
 * @param {*} root 创建的项目的路径
 * @param {*} appName 项目名
 * @param {*} originalDirectory 原来的工作目录
 */
async function run(root, appName, originalDirectory) {
    let scriptName = 'react-scripts'; // create生成的代码里 源文件编译，启动服务放在了react-scripts
    let templateName = 'cra-template';
    const allDependencies = ['react', 'react-dom', scriptName, templateName];

    console.log('Installing packages. This might take a couple of minutes.');
    // Installing react, react-dom, and react-scripts with cra-template
    console.log(
        `Installing ${chalk.cyan('react')}, ${chalk.cyan(
            'react-dom'
        )}, and ${chalk.cyan(scriptName)}${` with ${chalk.cyan(templateName)}`}...`
    );
    await install(root, allDependencies);
    //项目根目录    项目名字   verbose是否显示详细信息 原始的目录 模板名称cra-template
    let data = [root, appName, true, originalDirectory, templateName];
    let source = `
    const init = require('react-scripts/scripts/init.js');
    init.apply(null, JSON.parse(process.argv[1]));
    `;
    await executeNodeScript({ cwd: process.cwd() }, data, source);
    console.log('Done.');
    process.exit(0);//退出
}
// 执行node脚本函数
async function executeNodeScript({ cwd }, data, source) {
    return new Promise((resolve) => {
        const child = spawn(
            process.execPath,//node可执行文件的路径
            ['-e', source, '--', JSON.stringify(data)],
            { cwd, stdio: 'inherit' }
        );
        child.on('close', resolve);
    });
}
// 安装函数
async function install(root, allDependencies) {
    return new Promise(resolve => {
        const command = 'yarnpkg'; //yarnpkg = yarn
        const args = ['add', '--exact', ...allDependencies, '--cwd', root];
        console.log(command, args);
        const child = spawn(command, args, { stdio: 'inherit' });//stdio = 'inherit' 表示子进程的输出会直接打印到父进程中
        child.on('close', resolve);
    })
}

module.exports = {
    init
}