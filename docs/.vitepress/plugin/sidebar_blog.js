import formatDataSidebar from "./formatDataSidebar.js";
let arr = [
  {
    text: "学习",
    link: "view/blogs",
  },
  {
    text: "博客",
    link: "view/learningNotes",
    sort: true
  },
  {
    text: "黄金屋",
    link: "view/goldenHouse",
    sort: true
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
