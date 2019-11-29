从18.12.21 alpha.0 到 2019年10月11日alpha 0.32 --> beta.0, 到今天5.0.0-beta.3
[alpha.0](https://github.com/webpack/webpack/commits/master?after=f6f5364ad18fcf1b5a33e66d3350d6809ddb03e4+1749)

 从 17.12.05日 4.0.0-alpha.0 -> 18.12.24日4.0.0-beta.3发布 -> 18.12.25日4.0.0正式发布

[主要改进](https://github.com/webpack/changelog-v5/blob/master/README.md)

此版本重点关注以下内容：

* 我们尝试通过持久缓存提高构建性能--确定性块和模块ID
* 确定性混乱的出口名称。
* 命名块ID

在开发模式下默认启用的新命名块ID算法将为块（和文件名）提供易于理解的名称。模块ID由相对于的路径确定context。块ID由块的内容确定。

因此，您不再需要`import(/* webpackChunkName: "name" */ "module")`用于调试。但是，如果您要控制生产环境的文件名，那仍然有意义。

可以chunkIds: "named"在生产中使用，但请确保不要意外地泄露有关模块名称的敏感信息。

* 删除过时的功能。v4中弃用的所有项目均已删除。
* 自动删除Node.js Polyfills。
* JSON模块
* 嵌套摇树
webpack现在可以跟踪对导出的嵌套属性的访问。重新导出名称空间对象时，这可以改善“树状抖动”（未使用的导出消除和导出处理）
* 内部模块摇树
webpack 4没有分析模块导出和导入之间的依赖关系。webpack 5有一个新选项optimization.innerGraph，该选项默认在生产模式下启用，该选项对模块中的符号进行分析以找出从导出到导入的依赖性。

* 编译器空闲并关闭
现在需要在使用编译器后将其关闭。编译器现在进入和退出空闲状态，并具有这些状态的钩子。插件可以使用这些挂钩执行不重要的工作。（即，持久缓存将缓存缓慢存储到磁盘）。在编译器关闭时-所有剩余工作应尽快完成。回调表明关闭已完成。

* SplitChunk和模块大小
* 持久缓存
* 用于单个文件目标的SplitChunks
* 更新的解析器
* 没有JS的块
[webpack5不完全尝鲜](https://blog.nixiaolei.com/2019/09/15/%E3%80%90%E5%B7%A5%E7%A8%8B%E5%8C%96%E3%80%91webpack5%E4%B8%8D%E5%AE%8C%E5%85%A8%E5%B0%9D%E9%B2%9C/)
## 1. 基本概念

|概念 | 含义 |
|:--: |---|
|Entry | 入口， Webpack 执行构建的第一步将从Entry 开始，可以抽象成输入| 
|module | 模块，在Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的Entry 开始递归找出所有依赖的模块| 
|chunk| 代码块，一个 chunk 由多个模块组合而成，用于代码合并语分割|
|bundle| bundle就是Webpack打包后的各个文件，一般和chunk 是一对一的关系，bundle 是由chunk 编译打包后产出的|

## 2.项目初始化

```js
mkdir webpack5
cd webpack5
npm init 
npm i webpack@next -D
```

## 3.Webpack5初体验

### 4.1 webpack.config.js

webpack4.x 开始，将打包部分webpack-cli单独抽离出来，需要我们单独安装 `npm install -g webpack-cli`
> 值得注意的是，webpack-cli和webpack都必须是全局安装的。

在webpack4.x以前，我们将hello.js打包成另一个文件bundle.js可以通过`webpack hello.js bundle.js`命令来操作。
但是当我们在 webpack4.x 中通过`webpack hello.js bundle.js`打包时，会提示我们

```js
WARNING in configuration
The 'mode' option has not been set. Set  'mode' option to 'development' or 'production' to enable defaults for this enviroment.
ERROR in multi ./hello.js bundle.js
Module not found:ERROR:Can't resolve 'bundle.js' in 'C:/Users/你的用户名/Desktop/webpack-test'
@ multi ./hello.js bundle.js

```

这里提示我们存在的第一个问题是没有配置webpack的mode选项，默认有production和development两种模式可以设置，因此我们尝试设为development模式，在命令行输入：

```js
webpack --mode development
```
我们看到进行了打包并显示了Hash、Version、Time、Build at信息，表明已经可以打包。不过，仍然有错误提示：

```js
ERROR in Entry module not found:ERROR:Can't resolve './src' in 'C:/Users/你的用户名/Desktop/webpack-test'
```

这表明webpack4.x是以项目根目录下的'./src/index.js'作为入口，打包时只需要 `webpack --mode development` 或者 `webpack --mode production` 这样便会默认进行打包，入口文件是'./src/index.js'，输出路径是'./dist/main.js'，其中src目录即index.js文件需要手动创建，而dist目录及main.js会自动生成。

> 总结webpack4.x较webpack3.x的改变：
> 1、webpack-cli必须要全局安装，否则不能使用webpack指令；
> 2、webpack也必须要全局安装，否则也不能使用webpack指令。
> 3、webpack4.x中webpack.config.js这样的配置文件不是必须的。
> 4、默认入口文件是./src/index.js，默认输出文件./dist/main.js。


### 4.2 webpack-cli命令

1. webpack-cli 支持两个快捷选项：-d 和 -p，分别代表开发环境和生产环境的打包。
2. 可以通过参数 --display-error-details 来打印错误信息：npx webpack --display-error-details。
3. 可以通过命令：npx webpack --progress --colors 让编译输出的内容带有进度和颜色。
4. 如果不想每次修改模块后都重新编译，则可以开启监听模式，开启后，没有变化的模块会在编译后缓存到内存中，而不会每次都被重新编译，所以监听模式的整体速度是很快的：npx webpack --watch.
5. 通过 -hot 选项开启 Hot Module Replacement 模式。
6. 通过 -profile 选项详细的输出每个环节的用时，排查打包速度瓶颈。
7. 通过 -config 指定一个 webpack 配置文件的路径。

但是，webpack-cli 还不支持 webpack5， 所以需要手动打包

### 4.2 index.js
### 4.3 hello.js
### 4.4 index.js 打包文件
### 4.5 main.js

## 4. webpack实现代码分割方式
* entry配置： 通过多个 entry 文件来实现
* 动态加载（按需加载）： 通过主动使用import来动态加载
* 抽取公共代码： 使用 `splitChunks` 配置来抽取公共代码

### 4.1 entry 分割
### 4.1.2 webpack.config.js

```js
entry: {
  page1: "./src/page1.js",
  page2: "./src/page2.js",
  page3: "./src/page3.js"
}
```

### 4.2 按需加载
#### 4.2.1 webpack.config.js
```js
module.exports = {
  mode: 'development', 
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  }
}
```
### 4.2.2 index.js

```js
let button = document.createElement('button')
button.innerHTML = "点我试试"

button.addEventListener('click', event => {
  debugger
  import('./hello').then(result => {
    alert(result.default)
  })
})
document.body.appendChild(button)
```

### 4.2.3 hello.js

```js
module.exports = 'hello';
```
### 4.2.4 main.js

```js
...
// 第一步
__webpack_require__.e = chunkId => {
  return Promise.all(
    Object.keys(__webpack_require__.f).reduce((promises, key) => {
      __webpack_require__.f[key](chunkId, promises);
      return promises;
    }, [])
  );
};
....
// 第二步
__webpack_require__.f.j = (chunkId, promises) => {
  // 加载chunkId对应的代码块中的代码
  ...

  // 建立一个脚本 SONP的形式
  var script = document.createElement("script");
  var onScriptComplete;

  script.charset = "utf-8";
  script.timeout = 120;
  if (__webpack_require__.nc) {
    script.setAttribute("nonce", __webpack_require__.nc);
  }
  script.src = url;

  ...
}
// 第三步, 将jspon 回来的代码，合并到代码块中
function webpackJsonpCallback(data) {}
```

#### main.js 总结

1. 首先如果遇到 `import` 就会把这个 `import` 的模块单独打包到一个代码块里，这个代码块会单独生成一个文件。
2. 首次加载的时候只需要加载 `main.js` 当遇见 `import` 语句的时候，会向服务器发一个 `jsonp`请求，请求被分割出去的异步代码，然后合并到原来的 `modules`， 然后去加载这个新模块，并且把模块的exports导出对象后传递   

### 4.2.5 src_hello_js.js

见doc/src_hello_js.js

## 4.3 splitChunks
webpack 将会基于以下条件自动分割代码：

* 新的代码块被共享或者来自node_modules文件夹
* 新的代码块大于30kb
* 按需加载的数量应该<=5
* 初始化时加载代码块的请求数量应该<=3

### 4.3.1 webpack.config.js
### 4.3.2 index.js
见 dist\index.html

## 5. 实现webpack
webpack 整体编译过程，简单的来说就是：找到入口文件，寻找依关系，把依赖项变成树，然后生成一个文件放到硬盘上。

webpack 主体是一个 compiler, 每次webpack在编译的时候会产生一个compiler对象，完成整个编译过程，并将compiler返回。


### 5.1 AST

* [astexplorer](https://astexplorer.net/)
* Javascript Parser 把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操作这棵树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作。

[!image]()

### 5.2 工具

* [babylon](https://babeljs.io/docs/en/babylon.html) is a JavaScript parser used in Babel.将code转成AST.

> 我们可以把 babylon 解析代码的过程简单理解为：提取关键字 -> 继续解析后面的代码直到能完整的生成之前关键字的AST节点 -> 调用了finishToken，然后继续生成下一个节点 -> 解析到文件结尾，结束 这样一个过程。 重点的过程就是在解析到一个keyword之后对后面字符的解析。babylon 对特定的语法都有相关的函数来完成接下来的解析，如 parseVarStatement, parseIfStatement 等等。每一个 keyword 对应的解析函数，都对接下来的 解析到的 单词 or 字符 都有相应的期望值，babylon 会在此处来决定是继续解析来完成当前节点的渲染还是抛出异常。

大家可以通过[Esprima](https://esprima.org/demo/parse.html#) 这个网站来将代码转化成 ast。

参考文献：[Dynamic import](http://kbscript.com/2018/03/27/how-could-babel-complier-dynamic-import/)

* [babel-types](https://babeljs.io/docs/en/babel-types) 一款作用于 AST 的类 lodash 库，其封装了大量与 AST 有关的方法，大大降低了转换 AST 的成本。功能主要有两种：一方面可以用它验证 AST 节点的类型；另一方面可以用它构建 AST 节点.

* [babel-generator] 将AST转成正常code.
* [babel-traverse]一款用来自动遍历抽象语法树的工具，它会访问树中的所有节点，在进入每个节点时触发 enter 钩子函数，退出每个节点时触发 exit 钩子函数。开发者可在钩子函数中对 AST 进行修改。所以traverse负责对code 的增添查改。

```js
import traverse from "@babel/traverse";

traverse(ast, {
  enter(path) {
    // 进入 path 后触发
  },
  exit(path) {
    // 退出 path 前触发
  },
});

```

### 5.3 index.js
### 5.4 zfpack.js
### 5.5 main.js

## 6. 实现懒加载
### 6.1 src\index.js
### 6.2 zfpack.js
