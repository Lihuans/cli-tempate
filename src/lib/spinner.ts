// 用于显示加载中的效果，类似于前端页面的loading效果，想下载模版这种耗时的操作，有了loading效果，可以提示用户正在进行中，请耐心等待
import * as ora from 'ora'
// 颜色插件，用来修改命令行输出样式，通过颜色区分info、error日志，清晰直观
import * as chalk from 'chalk'

const spinner = ora()

export const startSpinner = (text?: string) => {
  const msg = `${text}...\n`
  spinner.start(msg)
  spinner.stopAndPersist({
    symbol: '✨',
    text: msg,
  })
}

export const succeedSpiner = (text?: string) => {
  spinner.stopAndPersist({
    symbol: '🎉',
    text: `${text}\n`
  })
}

export const failSpinner = (text?: string) => {
  spinner.fail(chalk.red(text))
}
