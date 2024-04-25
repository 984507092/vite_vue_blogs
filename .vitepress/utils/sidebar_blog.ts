import formatDataSidebar from "./formatDataSidebar";
let arr = [
  {
    text: "学习",
    link: "src/view/blogs",
  },
  {
    text: "博客",
    link: "src/view/learningNotes",
  },
];

export default {
  ...formatDataSidebar(arr),
};
