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
        }).parse(process.argv); // [node完整路径,当前node脚本的路径,...其它参数]
    console.log('projectName', projectName);
}

module.exports = {
    init
}