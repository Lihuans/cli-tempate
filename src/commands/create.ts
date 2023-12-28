import * as path from 'path'
// 提供了必要的功能，使你可以高效地构建语义化模板
import * as handlebars from 'handlebars'
// 交互式命令工具，给用户提供一个提问流方式
import * as inquirer from 'inquirer'
// import degit from 'degit'
import {
  cwd,
  chalk,
  execa,
  fs,
  startSpinner,
  succeedSpiner,
  failSpinner,
  warn,
  info,
} from '../lib'

const degit = require('degit')

// 检查是否已经存在相同名字工程
export const checkProjectExist = async (targetDir) => {
  if (fs.existsSync(targetDir)) {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'checkExist',
      message: `\n仓库路径${targetDir}已存在，请选择`,
      choices: ['覆盖', '取消'],
    })
    if (answer.checkExist === '覆盖') {
      warn(`删除${targetDir}...`)
      fs.removeSync(targetDir)
    } else {
      return true
    }
  }
  return false
}

// 选择模板
export const selecTpl = async () => {
  const answer = await inquirer.prompt({
    type: 'list',
    name: 'selecTpl',
    message: `请选择需要的项目类型`,
    choices: ['react-admin-vite-template', 'vue-mobile-template'],
  })
  // if (answer.selectProject === 'react') {
  //   console.log('选择了react项目')
  // } else if (answer.selectProject === 'vue2') {
  //   console.log('选择了vue2项目')
  // } else if (answer.selectProject === 'vue3') {
  //   console.log('选择了vue3项目')
  // }
  return answer.selecTpl
}

// 选择技术
export const selectProject = async () => {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'selectProject',
      message: `请选择需要的项目类型`,
      choices: [
        { name: 'react', value: 'react' },
        { name: 'vue2', value: 'vue2' },
        { name: 'vue3', value: 'vue3' }
      ],
    })
    if (answer.selectProject === 'react') {
      console.log('选择了react项目')
    } else if (answer.selectProject === 'vue2') {
      console.log('选择了vue2项目')
    } else if (answer.selectProject === 'vue3') {
      console.log('选择了vue3项目')
    }
    return answer
}

// 选择平台
export const selectPlat = async () => {
  const answer = await inquirer.prompt({
    type: 'list',
    name: 'selectPlat',
    message: `请选择需要的项目类型`,
    choices: ['admin', 'mobile'],
  })
  return answer.selectPlat
}

// 选择ui框架
export const selectUI = async () => {
  const answer = await inquirer.prompt({
    type: 'list',
    name: 'selectUI',
    message: `请选择需要的项目类型`,
    choices: [
      { name: 'antd-design', value: 'antd' },
      { name: 'element-ui', value: 'element' }
    ],
  })
  return answer.selectUI
}

export const getQuestions = async (projectName) => {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: `package name: (${projectName})`,
      default: projectName,
    },
    {
      type: 'input',
      name: 'description',
      message: 'description',
    },
    {
      type: 'input',
      name: 'author',
      message: 'author',
    },
  ])
}

export const downloadProject = async (targetDir, projectName, downloadName, projectInfo) => {
  startSpinner(`开始下载模板 ${chalk.cyan(targetDir)}`)
  const emitter = degit(`https://github.com/Lihuans/${downloadName}.git`)
    await emitter.clone(targetDir)
      .then(() => {
        succeedSpiner('download template succeed.')
      })
      .catch(() => {
        failSpinner('Request failed...')
      })
  // // 复制'project-template'到目标路径下创建工程
  // await fs.copy(
  //   path.join(__dirname, '..', '..', 'project-template'),
  //   targetDir
  // )

  console.log('开始替换模板====')
   // handlebars模版引擎解析用户输入的信息存在package.json
  const jsonPath = `${targetDir}/package.json`
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
  const jsonResult = handlebars.compile(jsonContent)(projectInfo)
  fs.writeFileSync(jsonPath, jsonResult)
  console.log('结束替换模板====')

  // 新建工程装包
  execa.commandSync('npm install', {
    stdio: 'inherit',
    cwd: targetDir,
  })

  succeedSpiner(
    `项目创建完成 ${chalk.yellow(projectName)}\n👉 输入以下启动项目:`
  )

  info(`$ cd ${projectName}\n$ npm run dev\n`)
}

export const cloneProject = async (targetDir, projectName, projectInfo) => {
  startSpinner(`开始创建私服仓库 ${chalk.cyan(targetDir)}`)
  // 复制'project-template'到目标路径下创建工程
  await fs.copy(
    path.join(__dirname, '..', '..', 'project-template'),
    targetDir
  )

   // handlebars模版引擎解析用户输入的信息存在package.json
  const jsonPath = `${targetDir}/package.json`
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
  const jsonResult = handlebars.compile(jsonContent)(projectInfo)
  fs.writeFileSync(jsonPath, jsonResult)

  // 新建工程装包
  execa.commandSync('npm install', {
    stdio: 'inherit',
    cwd: targetDir,
  })

  succeedSpiner(
    `私服仓库创建完成 ${chalk.yellow(projectName)}\n👉 输入以下命令开启私服:`
  )

  info(`$ cd ${projectName}\n$ sh start.sh\n`)
}

const action = async (projectName: string, cmdArgs?: any) => {
  try {
    const targetDir = path.join(
      (cmdArgs && cmdArgs.context) || cwd,
      projectName
    )
    // const project = await selectProject()
    // const plat = await selectPlat()
    // const ui = await selectUI()
    const tplName = await selecTpl()
    // console.log('project', project)
    if (!(await checkProjectExist(targetDir))) {
      // 获取选项手动输入的值，是一个对象
      const projectInfo = await getQuestions(projectName)
      console.log('projectInfo==', projectInfo)
      // await cloneProject(targetDir, projectName, projectInfo)
      await downloadProject(targetDir, projectName, tplName, projectInfo)
    }
  } catch (err) {
    failSpinner(err)
    return
  }
}

export default {
  command: 'create <registry-name>',
  description: '创建一个项目',
  optionList: [['--context <context>', '上下文路径']],
  action,
}
