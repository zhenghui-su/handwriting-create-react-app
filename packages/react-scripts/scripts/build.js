// 1.设置环境变量为生产环境
process.env.NODE_ENV = 'production'
const fs = require('fs-extra');//加强版的fs
const webpack = require('webpack');
// 2.获取webpack的配置文件
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const chalk = require('chalk');
const config = configFactory('production');

// 3.如果build目录不为空，要把build目录清空
fs.emptyDirSync(paths.appBuild);
// 4.拷贝public下面的静态文件到build目录
copyPublicFolder();
build();

function build() {
    // compiler是总的编译对象
    // @ts-ignore
    let compiler = webpack(config);
    // 开始启动编译
    compiler.run((err, stats) => {
        console.log(err);
        console.log(stats);//它是一个描述对象，描述本次打包出来的结果
        console.log(chalk.green('Compiled successfully!'));
    });
}

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        filter: file => file !== paths.appHtml // index.html文件交由插件编译处理，它不需要拷贝
    });
}