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
];

export default {
  ...formatDataSidebar(arr),
};
