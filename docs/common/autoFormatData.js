// posts.data.js
import { createContentLoader } from "vitepress";
 
export const pages = createContentLoader("view/blogs/*.md", {
  includeSrc: true, // 包含原始 markdown 源?
  render: false, // 包含渲染的整页 HTML?
  excerpt: false, // 包含摘录?
  transform(rawData) {
    // 根据需要对原始数据进行 map、sort 或 filter
    // 最终的结果是将发送给客户端的内容
    // return rawData
    //   .sort((a, b) => {
    //     return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
    //   })
    //   .map((page) => {
    //     page.src; // 原始 markdown 源
    //     page.html; // 渲染的整页 HTM
    //     page.excerpt; // 渲染的摘录 HTML（第一个 `---` 上面的内容）
    //     return {
    //       /* ... */
    //     };
    //   });

    console.log(rawData, "rawData");
  },
});