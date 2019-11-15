const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const babylon = require('babylon')//用源代码转成语法树
const types = require('babel-types')//用来判断某个节点是否是指定，或者用来生成一个新节点
const traverse = require('babel-traverse').default//用来遍历语法树的节点，并且对节点进行增删除改
const generator = require('babel-generator').default//用来把语法树重新变成代码
const {join,dirname}= path.posix

const mainTemplate = fs.readFileSync('./templete.ejs', 'utf-8')
/**
 * webpack 整体编译过程：
 * 1. 找到入口文件
 * 2. 寻找依关系
 * 3. 把依赖项变成树
 * 4. 然后生成一个文件放到硬盘上。
 */

class Compiler {
  constructor(options) {
    this.options = options
  }
  run(callback) {
    let { entry } = this.options
    this.modules = {}//这里面存放着我们所有的模块
    // {'./src/index.js':code} => moduleId: code
    this.buildModule(entry)
    this.emit() //完成后，要根据 modules 对象产出一个 bundle文件
    callback(null,'打包完成')
  }
  /**  
   * 把依赖项变成树
   * 源代码->babylon->语法树->traverse遍历树的所有节点，
   * 找到我们想要的节点
   * types生成新的节点替换老节点->generator重新生成代码
  */
  buildModule(moduleId) {
    let souceCode = fs.readFileSync(moduleId, 'utf-8')
    const ast = babylon.parse(souceCode)
    let dependencies = []
    /**
     * 源代码
     * let hello = require('./hello')
     * console.log(hello)
     * =>
     * let hello = __webpack_require__(
     *  "./src/hello.js"
     * )
     * console.log(hello)
     */

    traverse(ast, {
      CallExpression: (nodePath) => {
        if(nodePath.node.callee.name == 'require') {
          let node = nodePath.node
          node.callee.name = '__webpack_require__'

          let moduleName = node.arguments[0].value // './hello'
          let dependencyModuleId = `./${join(dirname(moduleId), moduleName)}.js`
         
          dependencies.push(dependencyModuleId)
          //'./hello' => { type: 'StringLiteral', value: './src/hello' } AST 格式
          node.arguments = [types.stringLiteral(dependencyModuleId)]
        }
      }
    })

    let { code } = generator(ast)

    this.modules[moduleId] = code
    dependencies.map(dependency => this.buildModule(dependency, dependency))
  }

  emit() {
    let { output, entry } = this.options
    console.log(entry)
    Object.keys(this.modules).forEach(chunkId => {
      let outFilePath = join(output.path, output.filename)
      let bundle = ejs.compile(mainTemplate)({
        entry,
        modules: this.modules
      })
      
      fs.writeFileSync(outFilePath, bundle, 'utf-8')
    })
    console.log(this.modules)
    // ejs('templete.ejs')({entry: this.entry})
  }
}
const webpack = (options, callback) => {
  let compiler = new Compiler(options)

  compiler.run(callback)
  return compiler
}

module.exports = webpack