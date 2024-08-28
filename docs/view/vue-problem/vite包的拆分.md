---
date: 2024-08-28
---

# vite 实现包的拆分

Vite 和 Rollup 是现代前端开发中两个非常流行的工具，它们各自有独特的用途和特点，但它们之间也存在一定的联系。

### Vite

Vite 是一个由 Vue 团队成员开发的前端构建工具，它的核心特点是在开发环境下提供极快的服务器启动和热模块替换（HMR），而在生产环境下使用 Rollup 进行打包。Vite 的设计目标是提供一种快速且轻量级的开发体验。

### Rollup

Rollup 是一个模块打包器，用于将多个模块文件打包成一个或多个 bundle，通常用于构建 JavaScript 库或前端应用程序。Rollup 以其高度可配置性和插件生态系统而闻名，能够处理ES6模块和其他多种模块类型。

### Vite 和 Rollup 的关系

1. **开发与生产环境的差异**：Vite 在开发环境中使用原生的 ES 模块导入（ESM）来提供快速的模块加载，而在生产环境中，`<span class="c-red">Vite 会使用 Rollup 进行代码的打包和优化</span>`。

2. **配置继承**：Vite 的生产环境配置是基于 Rollup 的，这意味着 Vite 允许开发者通过修改 Rollup 配置来定制生产环境的打包结果。

3. **插件系统**：Rollup 拥有一个强大的插件系统，Vite 在生产环境打包时会利用这个插件系统来实现各种高级功能，如代码分割、压缩、Tree-shaking 等。

4. **社区和生态系统**：由于 Rollup 在前端社区中的广泛使用，许多开发者已经熟悉了 Rollup 的配置和插件。Vite 通过在生产环境中使用 Rollup，使得这些开发者可以无缝地将他们的 Rollup 知识应用到 Vite 项目中。

5. **性能优化**：Rollup 提供了多种优化手段，如 Terser 插件进行代码压缩，Vue Plugin 处理 Vue 单文件组件等。Vite 在生产环境中利用这些优化手段来确保最终的打包文件尽可能小且高效。

### 为什么 Vite 打包配置要去看 Rollup

- Vite 本身在开发环境中提供了快速的开发体验，但在生产环境中，它需要依赖 Rollup 来完成代码的打包和优化。
- Rollup 提供了丰富的配置选项和插件，允许开发者根据项目需求进行定制。
- 由于 Vite 的生产环境配置是基于 Rollup 的，因此了解 Rollup 的配置对于优化 Vite 项目的构建过程至关重要。

总的来说，Vite 和 Rollup 虽然在开发和生产环境中有不同的角色，但它们之间的紧密联系使得开发者可以利用 Rollup 的强大功能来优化 Vite 项目的构建过程。

```js
 build: {
      rollupOptions: {
        output: {
          entryFileNames: "js/[name]-[hash].js",
          chunkFileNames: "js/[name]-[hash].js",
          assetFileNames(fileInfo) {
            if (fileInfo.name.endsWith('.css')) {
              return 'css/[name]-[hash].css';
            }
            const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp']
            if (imgExts.some(ext => fileInfo.name.endsWith(ext))) {
              return 'img/[name]-[hash].[ext]';
            }
            return 'asset/[name]-[hash].[ext]'
          }
        }
    }
 }
```
