const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const babylon = require('babylon')//用源代码转成语法树
const types = require('babel-types')//用来判断某个节点是否是指定，或者用来生成一个新节点
const traverse = require('babel-traverse').default//用来遍历语法树的节点，并且对节点进行增删除改
const generator = require('babel-generator').default//用来把语法树重新变成代码
const { join,dirname } = path.posix

const mainTemplate = fs.readFileSync('./mainTemplete.ejs', 'utf-8')
const chunkTemplate = fs.readFileSync('./chunk.ejs','utf8');
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
    this.chunks = { //这里面放着所有的代码块，
      main:{}
    }
    this.buildModule(entry, 'main')
    this.emit() //完成后，要根据 chunks 对象产出一个 bundle文件
    callback(null,'打包完成')
  }
  /**  
   * 把依赖项变成树
   * 源代码->babylon->语法树->traverse遍历树的所有节点，
   * 找到我们想要的节点
   * types生成新的节点替换老节点->generator重新生成代码
  */
  buildModule(moduleId, chunkId) {
    let souceCode = fs.readFileSync(moduleId, 'utf-8')
    const ast = babylon.parse(souceCode, {
      plugins: ['dynamicImport']
    })
    let dependencies = []
    
    traverse(ast, {
      CallExpression: (nodePath) => {
        let node = nodePath.node
        if(nodePath.node.callee.name == 'require') {
          let moduleName = node.arguments[0].value // './hello'
          let dependencyModuleId = `./${join(dirname(moduleId), moduleName)}.js`
          node.callee.name = '__webpack_require__'         
          dependencies.push(dependencyModuleId)
          //'./hello' => { type: 'StringLiteral', value: './src/hello' } AST 格式
          node.arguments = [types.stringLiteral(dependencyModuleId)]
        } else if(types.isImport(node.callee)) {
          /**
           * import('./hello').then(result => {
           *   alert(result.default)
           * })
           * =>
           * __webpack_require__.e("src_hello_js")
           * .then(__webpack_require__.t.bind(__webpack_require__,  "./src/hello.js", 7))
           */
          let moduleName = node.arguments[0].value
          let dependencyModuleId = `./${join(dirname(moduleId), moduleName)}`
          let dependencyChunkId = dependencyModuleId.slice(2).replace(/(\/|\.)/g, '_') + '.js'

          nodePath.replaceWithSourceString(`
            __webpack_require__.e("${dependencyChunkId}")
            .then(__webpack_require__.t.bind(__webpack_require__,  "${dependencyModuleId}", 7))
          `)
          this.buildModule(dependencyModuleId, dependencyChunkId)
        }
      }
    })

    let { code } = generator(ast)

    this.chunks[chunkId] = code
    dependencies.map(dependency => this.buildModule(dependency))
  }

  emit() {
    let { output, entry } = this.options

    Object.keys(this.chunks).forEach(chunkId => {
      if(chunkId == 'main') {
        let outFilePath = join(output.path, output.filename)
        let bundle = ejs.compile(mainTemplate)({
          entry,
          modules: this.modules
        })
        
        fs.writeFileSync(outFilePath, bundle, 'utf-8')
      } else {
        let extname = path.extname(chunkId)
        let basename = path.basename(chunkId, '.js')
        let outputFile = join(output.path, `${basename}.main${extname}`)
        let bundle = ejs.compile(chunkTemplate)({chunkId, modules:this.chunks[chunkId]});
        
        fs.writeFileSync(outputFile,bundle,'utf8');
      }
    })
  }
}
const webpack = (options, callback) => {
  let compiler = new Compiler(options)

  compiler.run(callback)
  return compiler
}

module.exports = webpack