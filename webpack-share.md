## 1. 发布时间
1. 17年12月 webpack4-alpha.0 -> 18年12月底 webpack4正式发布
2. 18年12月 webpack5-alpha.0 -> 至今beta.7

> webpack几乎是每年年底发布一个新版本，同时开始下一个版本的开发，以一年一个版本的进度。现在马上12月底，所以感觉webpack5 马上就可以发布了。当然新发布的版本肯定有很多坑，大家可以日常玩玩，不建议立即在项目中使用，但是这并不影响我们关注它的改进，这样有利于我们

[主要改进](https://github.com/webpack/changelog-v5/blob/master/README.md)

## 2. webpack5 主方向

#### 1. 尝试通过持久缓存提高构建性能(我的理解是加入了类似vdom的概念)
 
> 先简单地概述一下webpack的工作原理：webpack读取入口文件（entry），然后递归查找所依赖的模块(module)，构建成一个“依赖图”，然后根据配置中的加载器(loader)和打包策略来对模块进行编译。

> 但是如果中间有文件发生变化了，上面所述的整个递归遍历流程会重新再进行一次。

> webpack 5利用持久缓存优化了整个流程，当检测到某个文件变化时，依照“依赖图”，只对修改过的文件进行编译，从而大幅提高了编译速度。

要注意的是默认情况下不会启用持久化缓存。你可以自行选择启用。配置方式：

```js
module.exports = {
    cache: {
        type: "filesystem"
    }
}
```

> 为何如此？ webpack 旨在注重构建安全而非性能。 我们没有打算默认启用这一功能，主要原因在于此功能虽然有 95% 几率提升性能，但仍有 5% 的几率中断你的应用程序/工作流/构建。

所以下面的内容必须配置：

```js
module.exports = {
    cache: {
        type: "filesystem",
        buildDependencies: {
        	config: [ __filename ] 
        },
        name: `${env.target}`,
        version: `${process.env.GIT_REV}`
    }
}
```

[webpack 5 之持久化缓存](https://juejin.im/post/5da6c1c9e51d4577f3534ece)

--------

#### 2. 尝试使用更好的算法和默认值来改善长期缓存（long-term caching）。

> 开发模式将默认开启全新的命名chunk id算法，编译后的chunk名称可读性大大加强。
> 
> 模块ID(Module ID)由其相对于上下文的路径而确定，代码块ID(Chunk ID)由其内容来决定。eg: src_a_js.js

在生产环境中，可以使用下面的配置来启用新算法：

```js
module.exports = {
  optimization: {
    chunkIds: "deterministic",
    moduleIds: "deterministic"   
  }
}
```

Options 		 | Description
----   		 | ---
natural		 | 0.js, 1.js
size   		 | 0.js, 1.js
deterministic | 345.js
hashed        | abd6fa.js

但请确保不要意外地泄露有关模块名称的敏感信息!

> 新算法会以确定的方式为模块(module)和代码块(chunk)分配一个非常短（3或4个字符）的数字ID。所以，今后再生产环境中，如果你修改了vendor bundle中的一个依赖，那些并没有发生变化的模块ID也不会改变，所以仍然可以被浏览器缓存，提高资源加载的性能。

--------

#### 3. 尝试通过更好的树摇和代码生成来改善捆绑包大小

> webpack5放弃了对兼容做处理的相关代码， 转而交给用户去做， 以此将其代码量减少为之前的三分之一不到

> Tree-shaking的本质是消除无用的js代码。

> Tree-shaking 借助的是 DCE(dead code elimination） 思想，但是Javascript同传统的编程语言不同的是，javascript绝大多数情况需要通过网络进行加载，然后执行，加载的文件大小越小，整体执行时间更短，所以去除无用代码以减少文件体积，对javascript来说更有意义。Tree-shaking 和传统的 DCE的方法又不太一样，<strong>传统的DCE 消灭不可能执行的代码</strong>，而Tree-shaking 更关注宇消除没有用到的代码。

传统编译型的语言中，都是由编译器将Dead Code从AST（抽象语法树）中删除，那javascript中是由谁做DCE呢？

首先肯定不是浏览器做DCE，因为当我们的代码送到浏览器，那还谈什么消除无法执行的代码来优化呢，所以肯定是送到浏览器之前的步骤进行优化。

Tree-Shaking在前端界由rollup首先提出并实现，后续webpack在2.x版本也借助于UglifyJS实现了。

看下面的例子：

```js
// inner.js
export const aaaaa = 'aaaaa';
export const bbbbb = 'bbbbb';

// index.js
import * as module from "./inner";
console.log(module.inner.aaaaa);
```

开发模式下：aaaaa和bbbbb函数都被引入了，但是在生产环境下，只有aaaaa函数被引入。

##### 原理

> 前面提到了tree-shaking更关注于无用模块的消除，消除那些引用了但并没有被使用的模块。先思考一个问题，为什么tree-shaking是最近几年流行起来了？而前端模块化概念已经有很多年历史了，其实tree-shaking的消除原理是依赖于ES6的模块特性。
> 
> <strong>ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是tree-shaking的基础。</strong>
> 
> 所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6之前的模块化，比如我们可以动态require一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。

##### 副作用

许多开发者看到这里就很开心，以为自己引用的elementUI、antd 等库终于可以删掉一大半了。然而理想是丰满的，现实是骨干的。尝试后发现项目的压缩包并没有什么明显变化。

[原因](https://juejin.im/post/5a5652d8f265da3e497ff3de)

> 简单来说，成也babel，败也babel, code经过babel编译后变得有副作用了。
> 
> 例如，在编译es6的类的时候，babel采用Object.defineProperty（）对函数属性进行了包装（es6的属性是不可以枚举的，但是通过es5原型链声明的方法可以枚举）
> 
> uglify没有完善的程序流分析，函数的参数若是引用类型，对于它属性的操作，都是有可能会产生副作用的。

还有一点：

例如，还是上面的例子我们加上一点：

```js
// inner.js
export const aaaaa = 'aaaaa';
export const bbbbb = 'bbbbb';

// module.js
import * as inner from "./inner";
export { inner }

// index.js
import * as module from "./module";
console.log(module.inner.aaaaa);

```

此时，即使是生产环境下，bbbbb 函数也被引入了。这里插入已经，在webpack5在生产模式下，可以消除bbbbb 函数函数了。


##### 总结：

* tree-shaking，目前能做的：
 1. Webpack Tree shaking从ES6顶层模块开始分析，可以清除未使用的模块
 2. Webpack Tree shaking会对多层调用的模块进行重构，提取其中的代码，简化函数的调用结构 
 
 3. 如果使用第三方的模块，可以尝试直接从文件路径引用的方式使用

```js
	import { something } from "./something";

	function usingSomething() {
  		return something;
	}

	export function test() {
  		return usingSomething();
	}
	
```
 
```js
 	import { fn } from 'module'; 
	=> 
 	import fn from 'module/XX';

```
 
 
* 不能做的：
 1. Webpack Tree shaking不会清除IIFE
 
 > 因为IIFE比较特殊，它在被翻译时(JS并非编译型的语言)就会被执行，Webpack不做程序流分析，它不知道IIFE会做什么特别的事情，所以不会删除这部分代码

--------

* 我们尝试清除处于怪异状态的内部结构，同时在v4中实现功能而不引入任何重大更改。
* 我们现在尝试通过引入重大更改来为将来的功能做准备，以使我们能够尽可能长时间地使用v5。

* NodeJS的polyfill脚本被移除

> 最开始，webpack的目标是允许在浏览器中运行大多数的Node模块，但是现在模块格局已经发生了重大变化，现在有很多模块是专门为前端开发的。在v4及以前的版本中，对于大多数的Node模块将自动添加polyfill脚本（腻子脚本）。

> 然而，这些大量繁杂的脚本都会添加到最终编译的代码中(bundle)，但其实通常情况下是没有必要的。在v5版本中将尝试停止自动地添加polyfill脚本，转而专注于前端兼容模块。

> 在迁移到v5版本时，最好尽可能使用前端兼容模块，如果一定要用到核心模块的话，请为其添加polyfill(webpack会通过错误提示来指导帮助开发者)。


## 3. 基本概念

|概念 | 含义 |
|:--: |---|
|Entry | 入口， Webpack 执行构建的第一步将从Entry 开始，可以抽象成输入| 
|module | 模块，在Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的Entry 开始递归找出所有依赖的模块| 
|chunk| 代码块，一个 chunk 由多个模块组合而成，用于代码合并语分割|
|bundle| bundle就是Webpack打包后的各个文件，一般和chunk 是一对一的关系，bundle 是由chunk 编译打包后产出的|

## 4.项目初始化

```js
mkdir webpack5
cd webpack5
npm init 
npm i webpack@next -D
```

## 5.Webpack5初体验

### 5.1 webpack.config.js

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
> 
> 2、webpack也必须要全局安装，否则也不能使用webpack指令。
> 
> 3、webpack4.x中webpack.config.js这样的配置文件不是必须的。
> 
> 4、默认入口文件是./src/index.js，默认输出文件./dist/main.js。


### 5.2 webpack-cli命令

1. webpack-cli 支持两个快捷选项：-d 和 -p，分别代表开发环境和生产环境的打包。
2. 可以通过参数 --display-error-details 来打印错误信息：npx webpack --display-error-details。
3. 可以通过命令：npx webpack --progress --colors 让编译输出的内容带有进度和颜色。
4. 如果不想每次修改模块后都重新编译，则可以开启监听模式，开启后，没有变化的模块会在编译后缓存到内存中，而不会每次都被重新编译，所以监听模式的整体速度是很快的：npx webpack --watch.
5. 通过 -hot 选项开启 Hot Module Replacement 模式。
6. 通过 -profile 选项详细的输出每个环节的用时，排查打包速度瓶颈。
7. 通过 -config 指定一个 webpack 配置文件的路径。

但是，webpack-cli 还不支持 webpack5， 所以需要手动打包

## 6. 实现webpack
webpack 整体编译过程，简单的来说就是：找到入口文件，寻找依关系，把依赖项变成树，然后生成一个文件放到硬盘上。

webpack 主体是一个 compiler, 每次webpack在启动的时候会创建一个compiler对象，完成整个编译过程，并将compiler返回。

每次编译时compiler会创建一个Compilation实例，保存依赖。

### 6.1 AST

* [astexplorer](https://astexplorer.net/)
* Javascript Parser 把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操作这棵树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作。
![image](/Users/olifer/Desktop)

### 6.2 工具

* [babylon](https://babeljs.io/docs/en/babylon.html) is a JavaScript parser used in Babel.将code转成AST.

> 我们可以把 babylon 解析代码的过程简单理解为：提取关键字 -> 继续解析后面的代码直到能完整的生成之前关键字的AST节点 -> 调用了finishToken，然后继续生成下一个节点 -> 解析到文件结尾，结束 这样一个过程。 重点的过程就是在解析到一个keyword之后对后面字符的解析。babylon 对特定的语法都有相关的函数来完成接下来的解析，如 parseVarStatement, parseIfStatement 等等。每一个 keyword 对应的解析函数，都对接下来的 解析到的 单词 or 字符 都有相应的期望值，babylon 会在此处来决定是继续解析来完成当前节点的渲染还是抛出异常。

大家可以通过[Esprima](https://esprima.org/demo/parse.html#) 这个网站来将代码转化成 ast。

参考文献：[Dynamic import](http://kbscript.com/2018/03/27/how-could-babel-complier-dynamic-import/)

* [babel-types](https://babeljs.io/docs/en/babel-types) 一款作用于 AST 的类 lodash 库，其封装了大量与 AST 有关的方法，大大降低了转换 AST 的成本。功能主要有两种：一方面可以用它验证 AST 节点的类型；另一方面可以用它构建 AST 节点.

* [babel-generator] 将AST转成正常code.
* [babel-traverse]一款用来自动遍历抽象语法树的工具，它会访问树中的所有节点，在进入每个节点时触发 enter 钩子函数，退出每个节点时触发 exit 钩子函数。开发者可在钩子函数中对 AST 进行修改。所以traverse负责对code 的增添查改。

## 7. 轻触 babel
[一口气了解 babel](https://zhuanlan.zhihu.com/p/43249121)

[babel到底该如何配置](https://juejin.im/post/59ec657ef265da431b6c5b03)

## tapable

[Webpack tapable 使用研究](https://juejin.im/post/5d36faa9e51d45109725ff55)

```js
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");

```

webpack 本身声明了一系列的钩子函数，并在适当的时候触发他们。而我们的插件做的事情就是，在这些钩子函数上注册对应代码，使其可以在合理的时机，合理的调用。


例如， 

```js
// Compiler.js

class Compiler {
	constructor() {
		this.hooks = {
			done: new SyncHook()
		};
	}
	run() {
		this.hooks.done.call();
	}
}

```

```js
// Plugin.js
import Compiler from './Compiler';

const Compiler = new Compiler();

Compiler.hooks.done.tap('run', () => console.log('ready go'));
Compiler.run();

```

钩子的使用基本就是这个意思，Compiler中只负责声明和调用钩子，真正的执行逻辑，不再Compiler中，而是在注册它的Plugin.js之中，是在Compiler之外。这样就做到了很好的解耦。

> 钩子简介：

1. SyncHook
2. SyncBailHook： return了一个非undefined的值 那就不会往下走
3. SyncWaterfallHook: 它的每一步都依赖上一步的执行结果，也就是上一步return的值就是下一步的参数。
4. SyncLoopHook: SyncLoopHook是同步的循环钩子，它的插件如果返回一个非undefined。就会一直执行这个插件的回调函数，直到它返回undefined。
5. AsyncParallelHook: 异步并行执行的插件。
6. AsyncParallelBailHook: 有一个执行成功并且传递的值不是undefined，就调用最终的回调。
7. AsyncSeriesHook: 串行执行。就是插件一个一个的按顺序执行。
8. AsyncSeriesBailHook: 串行执行，并且只要一个插件有返回值，立马调用最终的回调，并且不会继续执行后续的插件。
9. AsyncSeriesWaterfallHook: 串行执行，并且前一个插件的返回值，会作为后一个插件的参数。

