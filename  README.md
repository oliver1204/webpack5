从18.12.21 alpha.0 到 2019年10月11日alpha 0.32 --> beta.0, 到今天5.0.0-beta.3


 从 17.12.05日 4.0.0-alpha.0 -> 18.12.24日4.0.0-beta.3发布 -> 18.12.25日4.0.0正式发布

## 1. webpack实现代码分割方式
* entry配置： 通过多个 entry 文件来实现
* 动态加载（按需加载）： 通过主动使用import来动态加载
* 抽取公共代码： 使用 `splitChunks` 配置来抽取公共代码

## 2. 基本概念

|概念 | 含义 |
|:--: |---|
|Entry | 入口， Webpack 执行构建的第一步将从Entry 开始，可以抽象成输入| 
|module | 模块，在Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的Entry 开始递归找出所有依赖的模块| 
|chunk| 代码块，一个 chunk 由多个模块组合而成，用于代码合并语分割|
|bundle| bundle就是Webpack打包后的各个文件，一般和chunk 是一对一的关系，bundle 是由chunk 编译打包后产出的|

## 3.项目初始化

```js
mkdir webpack5
cd webpack5
npm init 
npm i webpack@next -D
```

## 4.Webpack5初体验

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

## 5. entry 分割
### 5.1 webpack.config.js

## 6. 按需加载
### 6.1 webpack.config.js
### 6.2 index.js
### 6.3 hello.js
### 6.4 main.js
### 6.5 src_hello_js.js

## 7. splitChunks
webpack 将会基于以下条件自动分割代码：

* 新的代码块被共享或者来自node_modules文件夹
* 新的代码块大于30kb
* 按需加载的数量应该<=5
* 初始化时加载代码块的请求数量应该<=3

### 7.1 webpack.config.js
### 7.2 index.js
### dist\index.html

## 8. 实现webpack
webpack 整体编译过程，简单的来说就是：找到入口文件，寻找依关系，把依赖项变成树，然后生成一个文件放到硬盘上。

webpack 主体是一个 compiler, 每次webpack在编译的时候会产生一个compiler对象，完成整个编译过程，并将compiler返回。
### 8.1 AST

* [astexplorer](https://astexplorer.net/)
* Javascript Parser 把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操作这棵树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作。
![image](/Users/olifer/Desktop)

### 8.2 工具

* [babylon](https://babeljs.io/docs/en/babylon.html) is a JavaScript parser used in Babel.将code转成AST.

> 我们可以把 babylon 解析代码的过程简单理解为：提取关键字 -> 继续解析后面的代码直到能完整的生成之前关键字的AST节点 -> 调用了finishToken，然后继续生成下一个节点 -> 解析到文件结尾，结束 这样一个过程。 重点的过程就是在解析到一个keyword之后对后面字符的解析。babylon 对特定的语法都有相关的函数来完成接下来的解析，如 parseVarStatement, parseIfStatement 等等。每一个 keyword 对应的解析函数，都对接下来的 解析到的 单词 or 字符 都有相应的期望值，babylon 会在此处来决定是继续解析来完成当前节点的渲染还是抛出异常。

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

### 8.3 index.js
### 8.4 zfpack.js
### 8.5 main.js

## 9. 实现懒加载
### 9.1 src\index.js
### 9.2 zfpack.js
