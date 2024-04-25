import { set_sidebar } from "./auto-gen-sidebar.mjs";

export let mySidebar = {
  "/src/view/blogs/": set_sidebar("/blogs/"),
  "/src/view/learningNotes/": set_sidebar("/learningNotes/"),
};

