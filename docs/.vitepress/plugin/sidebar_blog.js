import formatDataSidebar from "./formatDataSidebar.js";
let arr = [
  {
    text: "学习",
    link: "view/blogs",
  },
  {
    text: "博客",
    link: "view/learningNotes",
  },
  {
    text: "问题",
    link: "view/problem",
  },
  {
    text: "TS问题",
    link: "view/typescript-problem",
  },
];

export default {
  ...formatDataSidebar(arr),
};
