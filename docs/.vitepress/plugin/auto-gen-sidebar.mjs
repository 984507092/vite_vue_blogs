// 为什么这里要用nodejs替代 createContentLoader
// createContentLoader 是一个用于 VitePress 插件或主题的辅助函数
// 它需要在 VitePress 进程启动后或 VitePress 配置解析完成后才能被调用
import path from 'node:path'
import fs from 'node:fs'

// 这里根据自己文件实际进行调整
const projectName = '/docs';
// 文件根目录
const DIR_PATH = path.resolve() + projectName;

// 添加以下两句话，让代码可以兼容window和linux启动路径问题
// 确保路径的斜杠方向
const normalizedPath = path.normalize(DIR_PATH);

// 确保路径的斜杠方向和正确的分隔符
const platformIndependentPath = normalizedPath.replace(/\\/g, '/');

// 白名单,过滤不是文章的文件和文件夹
const WHITE_LIST = [
    "index.md",
    ".vitepress",
    "node_modules",
    ".idea",
    "assets",
]


// 判断是否是文件夹
const isDirectory = (path) => fs.lstatSync(path).isDirectory()

// 取差值
const intersections = (arr1, arr2) => Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))))


/**
 * @param { string } params 项目文件名
 * @param {  string } path1 项目路径
 * @param {  string } pathname 项目地址
 * @param { boolean } sort 是否排序
 */
// 把方法导出直接使用
function getList(params, path1, pathname, sort) {
    // 存放结果
    const res = []
    // 开始遍历params
    for (let file in params) {
        // 拼接目录
        const dir = path.join(path1, params[file])
        // 判断是否是文件夹
        const isDir = isDirectory(dir)
        if (isDir) {
            // 如果是文件夹,读取之后作为下一次递归参数
            const files = fs.readdirSync(dir)
            res.push({
                text: params[file],
                collapsible: true,
                items: getList(files, dir, `${pathname}/${params[file]}`),
            })
        } else {
            // 获取名字
            const name = path.basename(params[file]);
            // 排除非 md 文件
            const suffix = path.extname(params[file]);
            if (suffix !== ".md") {
                continue;
            }

            res.push({
                text: name,
                link: `${name}`,
            });
        }
    }

    // 进行排序
    if (sort) {
        res.sort((a, b) => {
            let indexA = a.link.split(".")[0]
            let indexB = b.link.split(".")[0]
            return indexA - indexB;
        })
    }

    // 对name做一下处理，把后缀删除
    res.map((item) => {
        item.text = item.text.replace(/\.md$/, "");
    });
    // 如果base少一个左斜杠会导致高亮、上一页、下一页失效
    return {
        base: `/${pathname}/`,
        items: res
    }
}


/**
 * @param {  string } pathname 项目地址
 * @param { boolean } sort 是否排序
 */
export const set_sidebar = (pathname, sort = false) => {
    // 获取pathname的路径
    const dirPath = path.join(platformIndependentPath, pathname)
    // 读取pathname下的所有文件或者文件夹
    const files = fs.readdirSync(dirPath)
    // 过滤掉
    const items = intersections(files, WHITE_LIST)
    // getList 函数后面会讲到
    return getList(items, dirPath, pathname, sort)
}
