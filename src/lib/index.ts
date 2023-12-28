/**exports*/
export * from './consts'

export * from './spinner'

export * from './logger'

export const chalk = require('chalk')


// 承了fs所有方法和为fs方法添加了promise的支持。
export const fs = require('fs-extra')


// Execa 是一个 Node.js 库，可以替代 Node.js 的原生 child_process 模块，用于执行外部命令。
// Execa拥有更好的性能、可靠性和易用性，支持流式传输、输出控制、交互式 shell 等功能，并跨平台兼容 Windows、macOS 和 Linux 等操作系统。
// 同时，Execa 还支持 Promise API，提供更好的异步控制和异常处理机制。使用 Execa 可以简化发现和解决常见的子进程处理问题，是 Node.js 开发中非常有用的工具之一。
export const execa = require('execa')

