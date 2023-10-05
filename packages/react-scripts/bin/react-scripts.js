// 开启子进程
const spawn = require('cross-spawn');
// 获取命令行参数 ['build']
const args = process.argv.slice(2);
const script = args[0]; // build
// 以同步方式开始子进程执行scripts下面的build.js脚本
spawn.sync(
    process.execPath, // node的可执行文件路径
    [require.resolve('../scripts/' + script)],// 执行对应命令的文件如build.js
    { stdio: 'inherit' } // 让父进程和子进程共享输入输出
)