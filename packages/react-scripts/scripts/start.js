// 1.设置环境变量为开发环境
process.env.NODE_ENV = 'development';
// 2.获取配置文件的工厂
const configFactory = require('../config/webpack.config');
const config = configFactory('development');
//3.创建compiler编译对象
const chalk = require('chalk');
const webpack = require('webpack');
// @ts-ignore
const compiler = webpack(config);
// 4.获取devServer的配置对象
const createDevServerConfig = require('../config/webpackDevServer.config');
const serverConfig = createDevServerConfig();
const webpackDevServer = require('webpack-dev-server');
/**
 * 1.内部会启动compiler的编译
 * 2.会启动一个http服务器并返回编译后的结果
 */
const devServer = new webpackDevServer(compiler, serverConfig);
// 启动一个HTTP开发服务器，监听3000端口
devServer.listen(3000, 'localhost', () => {
    console.log(chalk.cyan('Starting the development server...'))
});